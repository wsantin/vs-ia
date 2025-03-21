import { BedrockRuntime } from "@aws-sdk/client-bedrock-runtime";
import { CodeError } from '../exceptions/codeError';
import { REGION_CODE } from '../common/constantes';

const bedrock = new BedrockRuntime({ region: REGION_CODE });

const SYSTEM_PROMPT = `
  Eres un asistente especializado en analizar información de candidatos en base a sus CVs. 
  Tu única función es responder preguntas relacionadas con la experiencia, habilidades, educación e información relevante de los candidatos proporcionados.
  Siempre responde de manera precisa y concisa. 
  Si la pregunta no está relacionada con los candidatos registrados, responde con: 
  "Solo puedo responder preguntas relacionadas con los candidatos proporcionados en los CVs."
  Evita respuestas largas o explicaciones innecesarias.
`;

export const askClaude35Sonnet = async (question: string, cvData: string[], modelId: string): Promise<string> => {
  try {
    console.log("question: ",question)

    // 🔹 Validar si la pregunta es irrelevante antes de enviarla a Claude
    const forbiddenKeywords = ["clima", "finanzas", "noticias", "entretenimiento", "chistes", "deportes"];
    if (forbiddenKeywords.some(word => question.toLowerCase().includes(word))) {
      throw new CodeError("Solo puedo responder preguntas relacionadas con los candidatos proporcionados en los CVs", 500);
    }

    const cvMessages = cvData.map((cv, index) => ({
      type: "text",
      text: `[CV ${index + 1}] ${cv}\n\n`
    }));

    const messages = [
      {
        role: "user",
        content: [
          { type: "text", text: SYSTEM_PROMPT },
          { type: "text", text: "Aquí tienes información de varios candidatos:\n\n" },
          ...cvMessages,
          { type: "text", text: `Pregunta: ${question}` }
        ]
      }
    ];

    const requestBody = {
      modelId: modelId,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 1000,
        messages: messages
      })
    };

    console.log("Enviando petición a Claude 3.5 con el siguiente prompt:", requestBody.body);
    
    // API CONVERTS - OTRA SOLUCION knowledgebase, Trabajar con Raw.
    // DB VECTORIAL, bedrock y trae el texto directamente.

    const response = await bedrock.invokeModel(requestBody);
    if (!response.body) throw new CodeError("Bedrock no devolvió respuesta válida", 409);

    const responseStr = Buffer.from(response.body as any).toString("utf8").trim();
    console.log("Respuesta sin procesar de Claude 3.5:", responseStr);

    let parsed;
    try {
      parsed = JSON.parse(responseStr);
    } catch (parseError) {
      console.error("Error al parsear la respuesta de Claude 3.5:", responseStr);
      throw new CodeError("Error al procesar la respuesta de Claude 3.5", 500);
    }

    if (!parsed.content || parsed.content.length === 0 || !parsed.content[0].text) {
      throw new CodeError("La IA no pudo generar una respuesta válida.", 500);
    }

    return parsed.content[0].text.trim();
  } catch (error: any) {
    console.error("Error en askClaude35Sonnet:", error);
    throw new CodeError("Error al procesar la pregunta con Claude 3.5", 500);
  }
};
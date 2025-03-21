import { BedrockRuntime } from "@aws-sdk/client-bedrock-runtime";
import { CodeError } from '../exceptions/codeError';
import { REGION_CODE } from '../common/constantes';

const bedrock = new BedrockRuntime({ region: REGION_CODE });

export const analyzeCVWithAI = async (text: string, modelId: string): Promise<string> => {
  try {
    const prompt = `Estructura la siguiente información de un CV en formato JSON con los campos: nombre, experiencia, tecnologías, ubicación, idiomas: \n\n"${text}"`;
    const params = {
      modelId: "anthropic.claude-v2",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({ inputText: prompt })
    };

    const response = await bedrock.invokeModel(params);
    if (!response.body) throw new CodeError("Bedrock no devolvió respuesta válida", 409);

    return JSON.parse(response.body!.toString()).outputText;
  } catch (error: any) {
    console.error('Error bedrock:', error);
    
    if (error?.name === "AccessDeniedException") {
      throw new CodeError("No tienes permisos para usar el modelo de Bedrock.", 403);
    }
    
    throw new CodeError("Error al procesar la pregunta con Bedrock", 500);
  }
}

export const askBedrock = async (question: string, cvData: any[], modelId: string): Promise<string> => {
  try {
    const prompt = `Aquí tienes información de candidatos: ${JSON.stringify(cvData)}. Responde la pregunta: ${question}`;
    const params = {
      modelId: "anthropic.claude-v2",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({ inputText: prompt })
    };

    const response = await bedrock.invokeModel(params);
    if (!response.body) throw new CodeError("Bedrock no devolvió respuesta válida", 409);

    return JSON.parse(response.body!.toString()).outputText;
  } catch (error: any) {
    console.error('Error bedrock:', error);
    
    if (error?.name === "AccessDeniedException") {
      throw new CodeError("No tienes permisos para usar el modelo de Bedrock.", 403);
    }
    
    throw new CodeError("Error al procesar la pregunta con Bedrock", 500);
  }
}
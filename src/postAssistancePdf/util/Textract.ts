import { Textract } from 'aws-sdk';
import { CodeError } from '../exceptions/codeError';

const textract = new Textract();

export const extractText = async (bucket: string, fileKey: string): Promise<string> => {
  try {
    // Inicia el análisis asíncrono
    const startParams = {
      DocumentLocation: { S3Object: { Bucket: bucket, Name: fileKey } },
      FeatureTypes: ["TABLES", "FORMS"]
    };
    
    const startResponse = await textract.startDocumentAnalysis(startParams).promise();
    if (!startResponse.JobId) {
      throw new CodeError('No se recibió JobId de Textract', 409);
    }
    const jobId = startResponse.JobId;
    
    // Función de espera (polling) para obtener el resultado final
    const getAnalysisResult = async (): Promise<Textract.GetDocumentAnalysisResponse> => {
      return await textract.getDocumentAnalysis({ JobId: jobId }).promise();
    };
    
    let analysisResponse = await getAnalysisResult();
    // Intentar hasta un máximo de 20 veces (cada 5 segundos)
    const maxAttempts = 20;
    let attempts = 0;
    while (analysisResponse.JobStatus !== 'SUCCEEDED' && attempts < maxAttempts) {
      if (analysisResponse.JobStatus === 'FAILED') {
        throw new CodeError('El job de Textract falló', 409);
      }
      await new Promise(resolve => setTimeout(resolve, 5000)); // espera 5 segundos
      analysisResponse = await getAnalysisResult();
      attempts++;
    }
    
    if (analysisResponse.JobStatus !== 'SUCCEEDED') {
      throw new CodeError('El job de Textract no se completó en el tiempo esperado', 409);
    }
    
    // Extrae el texto de los bloques, filtrando los que tengan contenido
    const text = analysisResponse.Blocks
      ?.map(block => block.Text)
      .filter(text => text) // descarta valores undefined
      .join(" ") || "";
      
    return text;
  } catch (error) {
    console.error('Error Textract:', error);
    throw new CodeError('Hubo un error al extraer la información con Textract', 409);
  }
};
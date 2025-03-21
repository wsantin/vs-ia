import { BUCKET_NAME, BUCKET_PATH_CV, BEDROCK_MODEL_ID } from '../common/constantes';
import { listFilesInS3 } from '../util/S3';
import { askBedrock, analyzeCVWithAI } from '../util/BedrockRuntime';
import { extractText } from '../util/Textract';
import { CodeError } from '../exceptions/codeError';

class PostAssistancePdfServices {
  static readonly Post = async (question: string) => {

    try {
      const files = await listFilesInS3(BUCKET_NAME, BUCKET_PATH_CV);
      const cvData = [];

      console.log("BEDROCK_MODEL_ID: ",BEDROCK_MODEL_ID)
      for (const file of files) {
        console.log(`Procesando archivo: ${file}`);
        const extractedText = await extractText(BUCKET_NAME, file);
        console.log(`Datos extraido `);
        const structuredCV = await analyzeCVWithAI(extractedText, BEDROCK_MODEL_ID);
        cvData.push(JSON.parse(structuredCV));
      }
    
      console.log("CVs procesados:", cvData);

      const answer = await askBedrock(question, cvData, BEDROCK_MODEL_ID);

      return answer;
    } catch (error: any) {
      if (error instanceof CodeError) {
        throw new CodeError(error.message, 409);
      }

      throw new CodeError('Error al procesar en el servicio.', 500);
    }
  }
}

export default PostAssistancePdfServices;
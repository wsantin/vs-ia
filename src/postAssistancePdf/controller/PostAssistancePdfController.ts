import { IPostAssistancePdfController } from '../interface/IPostAssistancePdfController';
import { IPostAssistancePdfModel } from '../interface/IPostAssistancePdfModel';
import PostAssistancePdfServices from '../services/PostAssistancePdfServices';
import { response } from '../util/Response';
import * as schema from '../schemas/PostAssistancePdfSchema';
import { CodeError } from '../exceptions/codeError';

class PostAssistancePdfController implements IPostAssistancePdfController {
    Post = async (event: any) => {
        console.info('PostAssistancePdfController-Event: ',event);
        let body: any = JSON.parse(event.body)

        try {
            // Validación con Joi
            const { error } = schema.IPostAssistancePdfSchema.validate(body);
            if (error) {
               console.error('Error de validación:', error.details);
               return response({
                    success: false,
                    message: error.message,
                    error: 'validateSchema',
                    data: null
                }, 400);
            }

           const serviceResponse: any = await PostAssistancePdfServices.Post(body);

           return response({
               success: true,
               message: 'Exitoso',
               error: null,
               data: serviceResponse
           }, 200);

        } catch (error: any) {

            return response({
                success: false,
                message: error.message ? error.message : 'Unexpected Error',
                error: error.name === 'CodeError' ? 'CodeError' : 'error',
                data: null
            }, 400);
        }
    }
}

export default PostAssistancePdfController;
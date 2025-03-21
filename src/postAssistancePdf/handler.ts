import PostAssistancePdfController from './controller/PostAssistancePdfController';

export const index = async (event: any, context: any, callback: any) => {
    return await new PostAssistancePdfController().Post(event);
};
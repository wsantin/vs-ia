const Joi = require('joi');

export const IPostAssistancePdfSchema = Joi.object({
    question: Joi.string().required(),
});
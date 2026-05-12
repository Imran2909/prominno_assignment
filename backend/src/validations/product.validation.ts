import Joi from 'joi';
import { objectIdSchema } from './common.validation.js';

export const createProductSchema = Joi.object({
  productName: Joi.string().trim().min(2).max(120).required(),
  productDescription: Joi.string().trim().min(2).max(1000).required(),
  brands: Joi.array()
    .items(
      Joi.object({
        brandName: Joi.string().trim().min(2).max(100).required(),
        detail: Joi.string().trim().min(2).max(1000).required(),
        image: Joi.string()
          .pattern(/^data:image\/(png|jpeg|jpg|webp);base64,/)
          .required()
          .messages({
            'string.pattern.base': 'Image must be a base64 data URL'
          }),
        price: Joi.number().positive().precision(2).required()
      })
    )
    .min(1)
    .required()
});

export const productIdParamSchema = Joi.object({
  id: objectIdSchema
});

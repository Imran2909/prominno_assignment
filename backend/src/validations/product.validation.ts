import Joi from 'joi';
import { imageDataUrlSchema, objectIdSchema } from './common.validation.js';

export const createProductSchema = Joi.object({
  productName: Joi.string().trim().min(2).max(120).required(),
  productDescription: Joi.string().trim().min(2).max(1000).required(),
  brands: Joi.array()
    .items(
      Joi.object({
        brandName: Joi.string().trim().min(2).max(100).required(),
        detail: Joi.string().trim().min(2).max(1000).required(),
        image: imageDataUrlSchema('Brand image'),
        price: Joi.number().positive().max(10_000_000).precision(2).required()
      })
    )
    .min(1)
    .max(20)
    .required()
});

export const productIdParamSchema = Joi.object({
  id: objectIdSchema
});

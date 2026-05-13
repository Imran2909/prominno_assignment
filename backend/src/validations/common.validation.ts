import Joi from 'joi';

const base64ImagePattern = /^data:image\/(png|jpeg|jpg|webp);base64,(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
export const maxImageDataUrlLength = 2_800_000;

export const objectIdSchema = Joi.string().hex().length(24).required().messages({
  'string.hex': 'Invalid id format',
  'string.length': 'Invalid id format'
});

export const imageDataUrlSchema = (fieldName: string) =>
  Joi.string()
    .trim()
    .max(maxImageDataUrlLength)
    .pattern(base64ImagePattern)
    .required()
    .messages({
      'string.max': `${fieldName} must be 2MB or smaller`,
      'string.pattern.base': `${fieldName} must be a valid PNG, JPG, JPEG, or WEBP base64 image`
    });

export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

export const idParamSchema = Joi.object({
  id: objectIdSchema
});

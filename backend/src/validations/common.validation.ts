import Joi from 'joi';

export const objectIdSchema = Joi.string().hex().length(24).required().messages({
  'string.hex': 'Invalid id format',
  'string.length': 'Invalid id format'
});

export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

export const idParamSchema = Joi.object({
  id: objectIdSchema
});

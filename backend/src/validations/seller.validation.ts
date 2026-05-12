import Joi from 'joi';

export const createSellerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(80).required(),
  profileImage: Joi.string()
    .pattern(/^data:image\/(png|jpeg|jpg|webp);base64,/)
    .required()
    .messages({
      'string.pattern.base': 'Profile image must be a base64 data URL'
    }),
  gender: Joi.string().valid('male', 'female', 'others').required(),
  email: Joi.string().email().lowercase().trim().required(),
  mobileNo: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required()
    .messages({
      'string.pattern.base': 'Mobile number must contain 10 to 15 digits'
    }),
  country: Joi.string().trim().min(2).max(80).required(),
  state: Joi.string().trim().min(2).max(80).required(),
  skills: Joi.array().items(Joi.string().trim().min(2).max(50)).min(1).required(),
  password: Joi.string().min(6).max(128).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().strip().messages({
    'any.only': 'Confirm password must match password'
  })
});

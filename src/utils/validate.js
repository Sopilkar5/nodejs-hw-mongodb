import createError from 'http-errors';
import Joi from 'joi';

export const validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    throw createError(400, error.details[0].message);
  }
  next();
};

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Name should be a string',
    'string.min': 'Name should have at least 3 characters',
    'string.max': 'Name should have at most 20 characters',
    'any.required': 'Name is required',
  }),
  phoneNumber: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Phone number should be a string',
    'string.min': 'Phone number should have at least 3 characters',
    'string.max': 'Phone number should have at most 20 characters',
    'any.required': 'Phone number is required',
  }),
  email: Joi.string().email().min(3).max(20).optional().messages({
    'string.email': 'Email must be a valid email address',
    'string.min': 'Email should have at least 3 characters',
    'string.max': 'Email should have at most 20 characters',
  }),
  isFavourite: Joi.bool().optional().messages({
    'boolean.base': 'isFavourite should be a boolean',
  }),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .required()
    .messages({
      'any.only': 'Contact type must be one of: work, home, personal',
      'any.required': 'Contact type is required',
    }),
  photo: Joi.string().uri().optional().messages({
    'string.uri': 'Photo must be a valid URL',
  }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).optional().messages({
    'string.base': 'Name should be a string',
    'string.min': 'Name should have at least 3 characters',
    'string.max': 'Name should have at most 20 characters',
  }),
  phoneNumber: Joi.string().min(3).max(20).optional().messages({
    'string.base': 'Phone number should be a string',
    'string.min': 'Phone number should have at least 3 characters',
    'string.max': 'Phone number should have at most 20 characters',
  }),
  email: Joi.string().email().min(3).max(20).optional().messages({
    'string.email': 'Email must be a valid email address',
    'string.min': 'Email should have at least 3 characters',
    'string.max': 'Email should have at most 20 characters',
  }),
  isFavourite: Joi.bool().optional().messages({
    'boolean.base': 'isFavourite should be a boolean',
  }),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .optional()
    .messages({
      'any.only': 'Contact type must be one of: work, home, personal',
    }),
  photo: Joi.any().optional(), // Дозволяємо будь-яке значення для photo (файл)
}).custom((value, helpers) => {
  // Дозволяємо оновлення, якщо є хоча б photo (req.file)
  const { file } = helpers.state.ancestors[0]; // Доступ до req.file з multer
  if (Object.keys(value).length === 0 && !file) {
    return helpers.error('any.required', { message: 'At least one field or photo must be provided for update' });
  }
  return value;
});

export const registerSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    'string.base': 'Name should be a string',
    'string.min': 'Name should have at least 3 characters',
    'any.required': 'Name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(8).required().messages({
    'string.base': 'Password should be a string',
    'string.min': 'Password should have at least 8 characters',
    'any.required': 'Password is required',
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(8).required().messages({
    'string.base': 'Password should be a string',
    'string.min': 'Password should have at least 8 characters',
    'any.required': 'Password is required',
  }),
});

export const sendResetEmailSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required',
  }),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages({
    'string.base': 'Token should be a string',
    'any.required': 'Token is required',
  }),
  password: Joi.string().min(8).required().messages({
    'string.base': 'Password should be a string',
    'string.min': 'Password should have at least 8 characters',
    'any.required': 'Password is required',
  }),
});

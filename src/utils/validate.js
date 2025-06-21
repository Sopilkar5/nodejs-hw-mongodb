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
  isFavourite: Joi.boolean().optional().messages({
    'boolean.base': 'isFavourite should be a boolean',
  }),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .required()
    .messages({
      'any.only': 'Contact type must be one of: work, home, personal',
      'any.required': 'Contact type is required',
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
  isFavourite: Joi.boolean().optional().messages({
    'boolean.base': 'isFavourite should be a boolean',
  }),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .optional()
    .messages({
      'any.only': 'Contact type must be one of: work, home, personal',
    }),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

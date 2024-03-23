// validations/builderValidation.js
const Joi = require('joi');

// Define your builder validation schema here
const skillSchema = Joi.array().items(
  Joi.object({
    skill: Joi.string(),
    category: Joi.string(),
    subSkills: Joi.array().items(Joi.string())
  })
)
  
const identitySchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().required(),
  description: Joi.string().required(),
  occupation: Joi.string().required(),
  gender: Joi.string().required(),
  birthday: Joi.string().required(),
  address: Joi.object({
    state: Joi.string(),
    city: Joi.string()
  }).required()
});

module.exports = {
  // Validation schema
  skillSchema,
  identitySchema
};

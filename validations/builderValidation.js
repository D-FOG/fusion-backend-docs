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
  profilePicture: Joi.object({
    data: Joi.binary(),
    contentType: Joi.string(),
  }),
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string().email(),
  phoneNumber: Joi.string(),
  description: Joi.string(),
  occupation: Joi.string(),
  gender: Joi.string(),
  birthday: Joi.string(),
  address: Joi.object({
    state: Joi.string(),
    city: Joi.string()
  })
});
module.exports = {
  // Validation schema
  skillSchema,
  identitySchema
};

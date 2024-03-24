// validations/hirerValidation.js
const Joi = require('joi');

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

const jobPostingSchema = Joi.object({
  jobTitle: Joi.string().required(),
  jobCategory: Joi.string().required(),
  jobDescription: Joi.string().required(),
  projectType: Joi.string(),
  tags: Joi.array().items(Joi.string()),
  jobLocation: Joi.string().required(),
  budget: Joi.number().required()
});

module.exports = {
  identitySchema,
  jobPostingSchema
};

// validations/hirerValidation.js
const Joi = require('joi');

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

const jobPostingSchema = Joi.object({
  jobTitle: Joi.string(),
  jobCategory: Joi.string(),
  jobDescription: Joi.string(),
  projectType: Joi.string(),
  tags: Joi.array().items(Joi.string()),
  jobLocation: Joi.string(),
  budget: Joi.number()
});

module.exports = {
  identitySchema,
  jobPostingSchema
};

// validations/advertiserValidation.js
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

const businessDescriptionSchema = Joi.object({
  businessTitle: Joi.string(),
  businessDescription: Joi.string()
});

const serviceSchema = Joi.array().items(
    Joi.object({
        imageName: Joi.string(),
        serviceTitle: Joi.string().required('serviceTitle is required'),
        serviceDescription: Joi.string().required('serviceDescription is required'),
    })
);

module.exports = {
  identitySchema,
  businessDescriptionSchema,
  serviceSchema
};

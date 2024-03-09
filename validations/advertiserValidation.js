// validations/advertiserValidation.js
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

const businessDescriptionSchema = Joi.object({
  businessTitle: Joi.string(),
  businessDescription: Joi.string()
});

const serviceSchema = Joi.array().items(
    Joi.object({
        serviceTitle: Joi.string(),
        serviceDescription: Joi.string(),
        serviceImage: Joi.string() // Assuming image is a URL, adjust as needed
    })
);

module.exports = {
  identitySchema,
  businessDescriptionSchema,
  serviceSchema
};

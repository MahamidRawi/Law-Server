const Joi = require('joi');

const authSchema = Joi.object({
  firstName: Joi.string()
  .min(1)
  .max(50)
  .required(),

  lastName: Joi.string()
  .min(1)
  .max(50)
  .required(),
  
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),

  password: Joi.string()
    .min(8).max(150)
    .required(),
    email: Joi.string()
  .email({ tlds: { allow: false } }) // 'tlds' option can be adjusted as needed
  .required(),
});

const inAuthSchema = Joi.object({
  email: Joi.string()
  .email({ tlds: { allow: false } }) // 'tlds' option can be adjusted as needed
  .required(),
  password: Joi.string()
    .min(8).max(150)
    .required(),
});

const mailSchema = Joi.object({
  targetMail: Joi.string()
  .email({ tlds: { allow: false } }) // 'tlds' option can be adjusted as needed
  .required(),
  subject: Joi.string().required(),
  body: Joi.string().required()
})

module.exports = {authSchema, inAuthSchema, mailSchema}
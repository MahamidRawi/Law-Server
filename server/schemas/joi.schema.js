const Joi = require('joi');
const { fieldsOfLaw, lawSystems } = require('../vars/vars');

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

const caseSchema = Joi.object({
  fieldOfLaw: Joi.string().valid(...fieldsOfLaw).required(),
  position: Joi.string().valid('defense', 'prosecution', 'random').required(),
  difficulty: Joi.string().valid('easy', 'medium', 'hard', 'extreme').required(),
  lawSystem: Joi.string().valid(...lawSystems).required()
})

module.exports = {authSchema, inAuthSchema, mailSchema, caseSchema}
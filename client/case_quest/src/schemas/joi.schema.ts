import Joi from 'joi'

const signUpSchema = Joi.object({
  firstName: Joi.string()
  .min(1)
  .max(100)
  .required(),

  lastName: Joi.string()
  .min(1)
  .max(100)
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
    .required()
});

const signInSchema = Joi.object({
  email: Joi.string()
  .email({ tlds: { allow: false } }) // 'tlds' option can be adjusted as needed
  .required(),
  password: Joi.string()
    .min(8).max(150)
    .required(),
});

export {signInSchema, signUpSchema}
const Joi = require('joi');

const JoiSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),

  firstName: Joi.string()
    .min(1)
    .max(100)
    .required(),

  lastName: Joi.string()
    .min(1)
    .max(100)
    .required(),

  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .required(),
});

module.exports = {JoiSchema}
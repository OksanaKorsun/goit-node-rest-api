const Joi = require("joi");
const userSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().required(),
});
module.exports = userSchema;

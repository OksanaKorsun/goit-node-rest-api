import Joi from "joi";
const userSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().required(),
});
export default userSchema;

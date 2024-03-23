import Joi from "joi";
export const userSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().required(),
});

export const emailUserSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required().messages({
    "any.required": "missing required field email",
  }),
});

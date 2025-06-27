const Joi = require("joi");

const signUpValidation = {
  body: Joi.object().keys({
    name: Joi.string().required().trim(),
    username: Joi.string().required().trim(),
    email: Joi.string().email().required().trim(),
    password: Joi.string().min(6).required().trim(),
    role: Joi.string().valid("guide", "learner").required(),
    profile: Joi.object({
      expertise: Joi.array().items(Joi.string()).optional(),
      interests: Joi.array().items(Joi.string()).optional(),
      experience: Joi.string().optional(),
    }).optional(),
  })
};

const signInValidation = {
  body: Joi.object().keys({
    email: Joi.string().email().required().trim(),
    password: Joi.string().required().trim(),
  })
};

module.exports = {
  signUpValidation,
  signInValidation
};
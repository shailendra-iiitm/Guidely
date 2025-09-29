const Joi = require("joi");

const signUpValidation = {
  body: Joi.object().keys({
    name: Joi.string().required().trim(),
    username: Joi.string().required().trim(),
    email: Joi.string().email().required().trim(),
    password: Joi.string().min(6).required().trim(),
    role: Joi.string().valid("guide", "learner", "admin").required(),
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

const forgotPasswordValidation = {
  body: Joi.object().keys({
    email: Joi.string().email().required().trim(),
  })
};

const verifyResetOtpValidation = {
  body: Joi.object().keys({
    email: Joi.string().email().required().trim(),
    otp: Joi.string().length(6).pattern(/^[0-9]+$/).required(),
  })
};

const resetPasswordValidation = {
  body: Joi.object().keys({
    email: Joi.string().email().required().trim(),
    otp: Joi.string().length(6).pattern(/^[0-9]+$/).required(),
    newPassword: Joi.string().min(6).required().trim(),
  })
};

module.exports = {
  signUpValidation,
  signInValidation,
  forgotPasswordValidation,
  verifyResetOtpValidation,
  resetPasswordValidation,
};
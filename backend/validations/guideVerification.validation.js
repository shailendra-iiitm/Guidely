const Joi = require("joi");

const reviewVerificationValidation = {
  body: Joi.object().keys({
    status: Joi.string().valid("approved", "rejected").required(),
    comments: Joi.string().optional().allow("").max(500),
  })
};

module.exports = {
  reviewVerificationValidation,
};
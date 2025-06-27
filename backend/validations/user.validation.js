const Joi = require("joi");

const updateUserProfileValidation = {
  body: Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    profile: Joi.object({
      tags: Joi.array().items(Joi.string()).optional(),
      title: Joi.string().allow('').optional(),
      bio: Joi.string().allow('').optional(),
      college: Joi.string().allow('').optional(),
      location: Joi.string().allow('').optional(),
      socialLinks: Joi.object({
        linkedin: Joi.string().allow('').optional(),
        github: Joi.string().allow('').optional(),
        Twitter: Joi.string().allow('').optional(),
        facebook: Joi.string().allow('').optional(),
        website: Joi.string().allow('').optional(),
      }).optional(),
    }).optional(),
  }).options({ allowUnknown: true })
};

module.exports = {
  updateUserProfileValidation,
};

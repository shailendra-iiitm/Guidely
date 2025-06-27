// backend/validations/booking.validation.js

const Joi = require("joi");

const initiateBookingValidation = {
  body: Joi.object().keys({
    serviceId: Joi.string().required().messages({
      'string.empty': 'Service ID is required',
      'any.required': 'Service ID is required'
    }),
    dateAndTime: Joi.alternatives().try(
      Joi.date().iso(),
      Joi.string().isoDate(),
      Joi.string()
    ).required().messages({
      'any.required': 'Date and time is required',
      'date.base': 'Invalid date format'
    }),
  }),
};

const updateMeetingLinkValidation = {
  body: Joi.object().keys({
    bookingId: Joi.string().required().messages({
      'string.empty': 'Booking ID is required',
      'any.required': 'Booking ID is required'
    }),
    meetingLink: Joi.string().uri().required().messages({
      'string.empty': 'Meeting link is required',
      'string.uri': 'Meeting link must be a valid URL',
      'any.required': 'Meeting link is required'
    })
  })
};

const markCompleteValidation = {
  body: Joi.object().keys({
    bookingId: Joi.string().required().messages({
      'string.empty': 'Booking ID is required',
      'any.required': 'Booking ID is required'
    }),
    sessionNotes: Joi.string().optional(),
    achievements: Joi.array().items(Joi.object({
      title: Joi.string().required(),
      description: Joi.string().optional()
    })).optional()
  })
};

const rateSessionValidation = {
  body: Joi.object().keys({
    bookingId: Joi.string().required().messages({
      'string.empty': 'Booking ID is required',
      'any.required': 'Booking ID is required'
    }),
    rating: Joi.number().integer().min(1).max(5).required().messages({
      'number.base': 'Rating must be a number',
      'number.integer': 'Rating must be an integer',
      'number.min': 'Rating must be at least 1',
      'number.max': 'Rating cannot exceed 5',
      'any.required': 'Rating is required'
    }),
    comment: Joi.string().optional()
  })
};

const startSessionValidation = {
  body: Joi.object().keys({
    bookingId: Joi.string().required().messages({
      'string.empty': 'Booking ID is required',
      'any.required': 'Booking ID is required'
    })
  })
};

const confirmBookingValidation = {
  body: Joi.object().keys({
    bookingId: Joi.string().required().messages({
      'string.empty': 'Booking ID is required',
      'any.required': 'Booking ID is required'
    }),
    meetingLink: Joi.string().uri().optional().messages({
      'string.uri': 'Meeting link must be a valid URL'
    })
  })
};

const rescheduleBookingValidation = {
  body: Joi.object().keys({
    bookingId: Joi.string().required().messages({
      'string.empty': 'Booking ID is required',
      'any.required': 'Booking ID is required'
    }),
    newDateTime: Joi.alternatives().try(
      Joi.date().iso(),
      Joi.string().isoDate(),
      Joi.string()
    ).required().messages({
      'any.required': 'New date and time is required',
      'date.base': 'Invalid date format'
    }),
    reason: Joi.string().optional()
  })
};

const cancelBookingValidation = {
  body: Joi.object().keys({
    bookingId: Joi.string().required().messages({
      'string.empty': 'Booking ID is required',
      'any.required': 'Booking ID is required'
    }),
    reason: Joi.string().optional()
  })
};

const feedbackValidation = {
  body: Joi.object().keys({
    bookingId: Joi.string().required().messages({
      'string.empty': 'Booking ID is required',
      'any.required': 'Booking ID is required'
    }),
    feedback: Joi.string().optional(),
    suggestions: Joi.string().optional(),
    highlights: Joi.string().optional()
  })
};

module.exports = {
  initiateBookingValidation,
  updateMeetingLinkValidation,
  markCompleteValidation,
  rateSessionValidation,
  startSessionValidation,
  confirmBookingValidation,
  rescheduleBookingValidation,
  cancelBookingValidation,
  feedbackValidation,
};

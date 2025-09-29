const { Schema, model } = require('mongoose');

const otpSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        otp: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ['password_reset', 'email_verification'],
            required: true
        },
        expiresAt: {
            type: Date,
            required: true,
            default: Date.now
        },
        used: {
            type: Boolean,
            default: false
        }
    },
    { 
        timestamps: true 
    }
);

// Index for automatic deletion
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
otpSchema.index({ email: 1, type: 1 });

const OtpModel = model('Otp', otpSchema);
module.exports = OtpModel;
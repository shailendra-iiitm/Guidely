const bcrypt = require('bcryptjs');
const { Schema, model } = require('mongoose');
const { type } = require('os');
const { title } = require('process');

/**
 * User Schema for Guidely
 * Supports both Guides and Learners via 'role'
 */

const userSchema = new Schema(
        {
            photoUrl:{type: String, default: ""},
            name: { type: String, required: true ,trim:true},
            username: { type: String, required: true, unique: true, trim: true },
            email: { type: String, required: true, unique: true, trim: true },
            password: { type: String, required: true, select: false },
            verified: { type: Boolean, default: false },
            isBlocked: { type: Boolean, default: false },
            role: {
                type: String,
                enum: ["guide", "learner", "admin"],
                default: null, //will be set upon registration
            },
            // Guide verification fields
            guideVerification: {
                status: {
                    type: String,
                    enum: ["pending", "approved", "rejected"],
                    default: "pending"
                },
                documents: {
                    identity: {
                        url: { type: String, default: "" },
                        publicId: { type: String, default: "" },
                        uploadedAt: { type: Date }
                    },
                    qualification: {
                        url: { type: String, default: "" },
                        publicId: { type: String, default: "" },
                        uploadedAt: { type: Date }
                    },
                    experience: {
                        url: { type: String, default: "" },
                        publicId: { type: String, default: "" },
                        uploadedAt: { type: Date }
                    }
                },
                submittedAt: { type: Date },
                reviewedAt: { type: Date },
                reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
                reviewComments: { type: String, default: "" }
            },
            // Password reset fields
            resetPasswordOtp: { type: String, select: false },
            resetPasswordExpiry: { type: Date, select: false },
            profile:{
                tags: { type: [String], default: [] }, //tags for search
                title: { type: String, default: "" }, //title for guides
                college: { type: String, default: "" }, //college for learners
                bio: { type: String, default: "" }, //short bio
                location: { type: String, default: "" }, //location for guides
                socialLinks: {
                    linkedin: { type: String, default: "" },
                    Twitter: { type: String, default: "" },
                    github: { type: String, default: "" },
                    facebook: { type: String, default: "" },
                    website: { type: String, default: "" },
                },
                // Guide-specific fields
                rating: {
                    average: { type: Number, default: 0 },
                    count: { type: Number, default: 0 },
                    total: { type: Number, default: 0 }
                },
                // Learner-specific fields  
                achievements: [{
                    title: { type: String, required: true },
                    description: { type: String, required: true },
                    earnedAt: { type: Date, default: Date.now },
                    category: { type: String, default: "session" },
                    icon: { type: String, default: "trophy" }
                }]
            },
            // Dashboard Metrics for Learners
            learnerMetrics: {
                totalSessions: { type: Number, default: 0 },
                skillsLearned: { type: [String], default: [] },
                currentStreak: { type: Number, default: 0 },
                totalHours: { type: Number, default: 0 },
                lastUpdated: { type: Date, default: Date.now }
            },
            // Dashboard Metrics for Guides
            guideMetrics: {
                totalSessions: { type: Number, default: 0 },
                uniqueLearners: { type: Number, default: 0 },
                skillsTaught: { type: [String], default: [] },
                totalEarnings: { type: Number, default: 0 },
                totalHours: { type: Number, default: 0 },
                lastUpdated: { type: Date, default: Date.now }
            }
        },
        { timestamps: true}
);

// Instance method for password check

userSchema.methods.isPasswordMatch = async function (password) {
    return await bcrypt.compare(password, this.password);
};

//
userSchema.pre('save', async function (next){
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

// Email index is already handled by unique: true in schema definition

// Export the User model
const UserModel = model('User', userSchema);
module.exports = UserModel;
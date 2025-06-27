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
            role: {
                type: String,
                enum: ["guide", "learner"],
                default: null, //will be set upon registration
            },
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

userSchema.index({email: 1});

// Export the User model
const UserModel = model('User', userSchema);
module.exports = UserModel;
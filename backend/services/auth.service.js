const UserModel = require("../models/user.model");
const OtpModel = require("../models/otp.model");
const ApiError = require("../helper/apiError");
const httpStatus = require("../util/httpStatus");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const createUser = async (data) => {
  try {
    console.log("Creating user with data:", { ...data, password: '[HIDDEN]' });
    
    // Check if user already exists
    const existingUser = await UserModel.findOne({ 
      $or: [{ email: data.email }, { username: data.username }] 
    });
    
    if (existingUser) {
      if (existingUser.email === data.email) {
        throw new ApiError(httpStatus.badRequest, "User with this email already exists");
      }
      if (existingUser.username === data.username) {
        throw new ApiError(httpStatus.badRequest, "Username already taken");
      }
    }
    
    const user = await UserModel.create(data);
    console.log("User created successfully:", user.email);
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    if (error.code === 11000) {
      // Handle duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      throw new ApiError(httpStatus.badRequest, `${field} already exists`);
    }
    throw error;
  }
};

const loginUserWithEmailAndPassword = async (email, password) => {
  try {
    console.log("Attempting login for email:", email);
    
    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
      console.log("User not found for email:", email);
      throw new ApiError(httpStatus.unauthorized, "Incorrect email or password");
    }
    
    console.log("User found, checking password");
    const isPasswordMatch = await user.isPasswordMatch(password);
    
    if (!isPasswordMatch) {
      console.log("Password mismatch for user:", email);
      throw new ApiError(httpStatus.unauthorized, "Incorrect email or password");
    }
    
    console.log("Login successful for user:", email);
    return user;
  } catch (error) {
    console.error("Error in loginUserWithEmailAndPassword:", error);
    throw error;
  }
};

const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const sendPasswordResetOtp = async (email) => {
  try {
    console.log("Sending password reset OTP to:", email);
    
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new ApiError(httpStatus.notFound, "User not found with this email address");
    }

    // Generate OTP
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any existing OTPs for this email and type
    await OtpModel.deleteMany({ email, type: 'password_reset' });

    // Create new OTP record
    await OtpModel.create({
      email,
      otp,
      type: 'password_reset',
      expiresAt
    });

    console.log("OTP generated and saved for:", email);
    return { otp, user };
  } catch (error) {
    console.error("Error in sendPasswordResetOtp:", error);
    throw error;
  }
};

const verifyPasswordResetOtp = async (email, otp) => {
  try {
    console.log("Verifying OTP for email:", email);
    
    const otpRecord = await OtpModel.findOne({
      email,
      otp,
      type: 'password_reset',
      used: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      throw new ApiError(httpStatus.badRequest, "Invalid or expired OTP");
    }

    // Mark OTP as used
    otpRecord.used = true;
    await otpRecord.save();

    console.log("OTP verified successfully for:", email);
    return true;
  } catch (error) {
    console.error("Error in verifyPasswordResetOtp:", error);
    throw error;
  }
};

const resetPassword = async (email, newPassword) => {
  try {
    console.log("Resetting password for:", email);
    
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new ApiError(httpStatus.notFound, "User not found");
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 8);
    
    // Update user password
    user.password = hashedPassword;
    await user.save();

    // Clean up used OTPs
    await OtpModel.deleteMany({ email, type: 'password_reset' });

    console.log("Password reset successful for:", email);
    return user;
  } catch (error) {
    console.error("Error in resetPassword:", error);
    throw error;
  }
};

const createAdminUser = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await UserModel.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log("Admin user already exists");
      return existingAdmin;
    }

    // Create admin user with default credentials
    const adminData = {
      name: "System Administrator",
      username: "admin",
      email: "admin@guidely.com",
      password: "Admin@123",
      role: "admin",
      verified: true
    };

    const admin = await UserModel.create(adminData);
    console.log("Admin user created successfully");
    return admin;
  } catch (error) {
    console.error("Error creating admin user:", error);
    throw error;
  }
};

module.exports = {
  createUser,
  loginUserWithEmailAndPassword,
  sendPasswordResetOtp,
  verifyPasswordResetOtp,
  resetPassword,
  createAdminUser,
};
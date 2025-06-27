const UserModel = require("../models/user.model");
const ApiError = require("../helper/apiError");
const httpStatus = require("../util/httpStatus");

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

module.exports = {
  createUser,
  loginUserWithEmailAndPassword,
};
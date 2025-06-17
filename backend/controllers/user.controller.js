const cloudinary = require("cloudinary").v2;
const config = require("../config");
const userService = require("../services/user.service");
const httpStatus = require("../util/httpStatus");
const ApiError = require("../helper/apiError");

// Cloudinary configuration
cloudinary.config(config.cloudinary);

// Upload profile photo
const uploadPhoto = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "user_photos",
      use_filename: true,
    });
    const updatedUser = await userService.updateUserPhoto(req.user._id, result.secure_url);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "Photo uploaded successfully",
      photoUrl: updatedUser.photoUrl,
    });
  } catch (error) {
    console.error("Error uploading photo:", error);
    res.status(500).json({ message: "Error uploading photo" });
  }
};

// Get logged-in user details
const getUser = async (req, res, next) => {
  const userId = req.user._id;
  const user = await userService.getUserById(userId);
  if (!user) {
    return next(new ApiError(httpStatus.notFound, "User not found"));
  }
  res.status(httpStatus.ok).json({ success: true, user });
};

// Update profile
const updateUserProfile = async (req, res, next) => {
  const userId = req.user._id;
  const profileData = req.body;
  const updatedUser = await userService.updateUserProfile(userId, profileData);
  if (!updatedUser) {
    return next(new ApiError(httpStatus.notFound, "User not found"));
  }
  res.status(httpStatus.ok).json({
    success: true,
    message: "Profile updated successfully",
    user: updatedUser,
  });
};

module.exports = {
    uploadPhoto,
    getUser,
    updateUserProfile
};
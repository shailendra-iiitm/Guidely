const UserModel = require("../models/user.model");
const cloudinary = require("cloudinary").v2;
const config = require("../config");
const ApiError = require("../helper/apiError");
const httpStatus = require("../util/httpStatus");

// Configure Cloudinary
cloudinary.config(config.cloudinary);

const uploadDocumentToCloudinary = async (fileBuffer, fileName, folder = "guidely/verification") => {
  try {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: folder,
          public_id: `${Date.now()}_${fileName}`,
          quality: "auto:good",
          fetch_format: "auto"
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            resolve({
              url: result.secure_url,
              publicId: result.public_id
            });
          }
        }
      ).end(fileBuffer);
    });
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new ApiError(httpStatus.internalServerError, "Failed to upload document");
  }
};

const deleteDocumentFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    // Don't throw error as this is cleanup
  }
};

const submitGuideVerification = async (userId, documents) => {
  try {
    console.log("Submitting guide verification for user:", userId);

    const user = await UserModel.findById(userId);
    if (!user) {
      throw new ApiError(httpStatus.notFound, "User not found");
    }

    if (user.role !== "guide") {
      throw new ApiError(httpStatus.badRequest, "Only guides can submit verification documents");
    }

    // Update user with document URLs and set status to pending
    user.guideVerification.status = "pending";
    user.guideVerification.documents = documents;
    user.guideVerification.submittedAt = new Date();

    await user.save();

    console.log("Guide verification submitted successfully");
    return user;
  } catch (error) {
    console.error("Error in submitGuideVerification:", error);
    throw error;
  }
};

const reviewGuideVerification = async (adminId, guideId, status, comments = "") => {
  try {
    console.log("Reviewing guide verification:", { adminId, guideId, status });

    const admin = await UserModel.findById(adminId);
    if (!admin || admin.role !== "admin") {
      throw new ApiError(403, "Only admins can review verifications");
    }

    const guide = await UserModel.findById(guideId);
    if (!guide) {
      throw new ApiError(404, "Guide not found");
    }

    if (guide.role !== "guide") {
      throw new ApiError(400, "User is not a guide");
    }

    // Update verification status
    guide.guideVerification.status = status;
    guide.guideVerification.reviewedAt = new Date();
    guide.guideVerification.reviewedBy = adminId;
    guide.guideVerification.reviewComments = comments;

    // If approved, mark user as verified
    if (status === "approved") {
      guide.verified = true;
    }

    await guide.save();

    console.log("Guide verification reviewed successfully");
    return guide;
  } catch (error) {
    console.error("Error in reviewGuideVerification:", error);
    throw error;
  }
};

const getPendingVerifications = async () => {
  try {
    console.log("Getting pending verifications");

    const pendingGuides = await UserModel.find({
      role: "guide",
      "guideVerification.status": "pending"
    }).select("name email username guideVerification profile.title createdAt");

    return pendingGuides;
  } catch (error) {
    console.error("Error in getPendingVerifications:", error);
    throw error;
  }
};

const getGuideVerificationStatus = async (userId) => {
  try {
    console.log("Getting verification status for user:", userId);

    const user = await UserModel.findById(userId);
    if (!user) {
      throw new ApiError(httpStatus.notFound, "User not found");
    }

    if (user.role !== "guide") {
      throw new ApiError(httpStatus.badRequest, "User is not a guide");
    }

    return {
      status: user.guideVerification.status,
      documents: user.guideVerification.documents,
      submittedAt: user.guideVerification.submittedAt,
      reviewedAt: user.guideVerification.reviewedAt,
      reviewComments: user.guideVerification.reviewComments,
      verified: user.verified
    };
  } catch (error) {
    console.error("Error in getGuideVerificationStatus:", error);
    throw error;
  }
};

const getVerifiedGuides = async (filters = {}) => {
  try {
    console.log("Getting verified guides with filters:", filters);

    const query = {
      role: "guide",
      verified: true,
      "guideVerification.status": "approved"
    };

    // Add additional filters if provided
    if (filters.tags && filters.tags.length > 0) {
      query["profile.tags"] = { $in: filters.tags };
    }

    if (filters.location) {
      query["profile.location"] = new RegExp(filters.location, 'i');
    }

    const guides = await UserModel.find(query)
      .select("name email username profile photoUrl guideVerification createdAt")
      .sort({ "profile.rating.average": -1, createdAt: -1 });

    return guides;
  } catch (error) {
    console.error("Error in getVerifiedGuides:", error);
    throw error;
  }
};

module.exports = {
  uploadDocumentToCloudinary,
  deleteDocumentFromCloudinary,
  submitGuideVerification,
  reviewGuideVerification,
  getPendingVerifications,
  getGuideVerificationStatus,
  getVerifiedGuides,
};
const guideVerificationService = require("../services/guideVerification.service");
const httpStatus = require("../util/httpStatus");

const uploadDocuments = async (req, res) => {
  try {
    const userId = req.user.id;
    const files = req.files;

    console.log("Upload documents request for user:", userId);
    console.log("Files received:", Object.keys(files || {}));

    if (!files || Object.keys(files).length === 0) {
      return res.status(httpStatus.badRequest).json({
        message: "No documents uploaded"
      });
    }

    const documents = {
      identity: { url: "", publicId: "", uploadedAt: null },
      qualification: { url: "", publicId: "", uploadedAt: null },
      experience: { url: "", publicId: "", uploadedAt: null }
    };

    // Upload each document type
    for (const [documentType, fileArray] of Object.entries(files)) {
      if (documents.hasOwnProperty(documentType) && fileArray && fileArray[0]) {
        const file = fileArray[0];
        const uploadResult = await guideVerificationService.uploadDocumentToCloudinary(
          file.buffer,
          file.originalname,
          `guidely/verification/${userId}`
        );
        
        documents[documentType] = {
          url: uploadResult.url,
          publicId: uploadResult.publicId,
          uploadedAt: new Date()
        };
      }
    }

    // Submit verification with uploaded documents
    const user = await guideVerificationService.submitGuideVerification(userId, documents);

    res.status(httpStatus.ok).json({
      message: "Documents uploaded and verification submitted successfully",
      verificationStatus: user.guideVerification.status,
      documents: user.guideVerification.documents
    });
  } catch (error) {
    console.error("Upload documents error:", error);
    throw error;
  }
};

const getVerificationStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    console.log("Get verification status request for user:", userId);

    const status = await guideVerificationService.getGuideVerificationStatus(userId);

    res.status(httpStatus.ok).json({
      message: "Verification status retrieved successfully",
      verificationStatus: status
    });
  } catch (error) {
    console.error("Get verification status error:", error);
    throw error;
  }
};

const reviewVerification = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { guideId } = req.params;
    const { status, comments } = req.body;

    console.log("Review verification request:", { adminId, guideId, status });

    const guide = await guideVerificationService.reviewGuideVerification(
      adminId,
      guideId,
      status,
      comments
    );

    res.status(httpStatus.ok).json({
      message: `Guide verification ${status} successfully`,
      guide: {
        id: guide._id,
        name: guide.name,
        email: guide.email,
        verificationStatus: guide.guideVerification.status,
        verified: guide.verified
      }
    });
  } catch (error) {
    console.error("Review verification error:", error);
    throw error;
  }
};

const getPendingVerifications = async (req, res) => {
  try {
    console.log("Get pending verifications request");

    const pendingGuides = await guideVerificationService.getPendingVerifications();

    res.status(httpStatus.ok).json({
      message: "Pending verifications retrieved successfully",
      count: pendingGuides.length,
      pendingGuides
    });
  } catch (error) {
    console.error("Get pending verifications error:", error);
    throw error;
  }
};

const getVerifiedGuides = async (req, res) => {
  try {
    const { tags, location } = req.query;
    
    console.log("Get verified guides request with filters:", { tags, location });

    const filters = {};
    if (tags) {
      filters.tags = Array.isArray(tags) ? tags : tags.split(',');
    }
    if (location) {
      filters.location = location;
    }

    const guides = await guideVerificationService.getVerifiedGuides(filters);

    res.status(httpStatus.ok).json({
      message: "Verified guides retrieved successfully",
      count: guides.length,
      guides
    });
  } catch (error) {
    console.error("Get verified guides error:", error);
    throw error;
  }
};

module.exports = {
  uploadDocuments,
  getVerificationStatus,
  reviewVerification,
  getPendingVerifications,
  getVerifiedGuides,
};
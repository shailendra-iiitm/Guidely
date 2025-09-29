const express = require("express");
const userService = require("../../services/auth.service");
const adminManagementController = require("../../controllers/adminManagement.controller");
const asyncHandler = require("../../helper/asyncHandler");
const { protect, adminOnly } = require("../../middleware/auth");
const httpStatus = require("../../util/httpStatus");

const router = express.Router();

// Initialize admin user (can be called once during setup)
router.post(
  "/init-admin",
  asyncHandler(async (req, res) => {
    try {
      const admin = await userService.createAdminUser();
      
      res.status(httpStatus.ok).json({
        message: "Admin user initialized successfully",
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          username: admin.username,
          role: admin.role
        }
      });
    } catch (error) {
      console.error("Admin initialization error:", error);
      throw error;
    }
  })
);

// Admin dashboard - get system stats
router.get(
  "/dashboard",
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    try {
      const UserModel = require("../../models/user.model");
      
      const stats = {
        totalUsers: await UserModel.countDocuments(),
        totalGuides: await UserModel.countDocuments({ role: "guide" }),
        totalLearners: await UserModel.countDocuments({ role: "learner" }),
        verifiedGuides: await UserModel.countDocuments({ 
          role: "guide", 
          verified: true,
          "guideVerification.status": "approved"
        }),
        pendingVerifications: await UserModel.countDocuments({
          role: "guide",
          "guideVerification.status": "pending"
        })
      };

      res.status(httpStatus.ok).json({
        message: "Admin dashboard data retrieved successfully",
        stats
      });
    } catch (error) {
      console.error("Admin dashboard error:", error);
      throw error;
    }
  })
);

// User management routes
router.get(
  "/users",
  protect,
  adminOnly,
  asyncHandler(adminManagementController.getAllUsers)
);

router.get(
  "/users/:userId",
  protect,
  adminOnly,
  asyncHandler(adminManagementController.getUserById)
);

router.patch(
  "/users/:userId/status",
  protect,
  adminOnly,
  asyncHandler(adminManagementController.updateUserStatus)
);

router.delete(
  "/users/:userId",
  protect,
  adminOnly,
  asyncHandler(adminManagementController.deleteUser)
);

router.get(
  "/detailed-stats",
  protect,
  adminOnly,
  asyncHandler(adminManagementController.getDetailedStats)
);

module.exports = router;
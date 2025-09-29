const UserModel = require("../models/user.model");
const BookingModel = require("../models/booking.model");
const httpStatus = require("../util/httpStatus");

const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, status, search } = req.query;
    
    const filter = {};
    if (role) filter.role = role;
    if (status === 'verified') filter.verified = true;
    if (status === 'unverified') filter.verified = false;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const users = await UserModel.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await UserModel.countDocuments(filter);

    res.status(httpStatus.ok).json({
      message: "Users retrieved successfully",
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error("Get all users error:", error);
    throw error;
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await UserModel.findById(userId).select('-password');
    if (!user) {
      return res.status(httpStatus.notFound).json({
        message: "User not found"
      });
    }

    // Get user's bookings if they are a guide or learner
    let bookings = [];
    if (user.role === 'guide' || user.role === 'learner') {
      const bookingFilter = user.role === 'guide' ? { guide: userId } : { user: userId };
      bookings = await BookingModel.find(bookingFilter)
        .populate('guide', 'name email')
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(10);
    }

    res.status(httpStatus.ok).json({
      message: "User details retrieved successfully",
      user,
      bookings
    });
  } catch (error) {
    console.error("Get user by ID error:", error);
    throw error;
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { verified, role } = req.body;
    
    const updateData = {};
    if (typeof verified !== 'undefined') updateData.verified = verified;
    if (role) updateData.role = role;

    const user = await UserModel.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(httpStatus.notFound).json({
        message: "User not found"
      });
    }

    res.status(httpStatus.ok).json({
      message: "User status updated successfully",
      user
    });
  } catch (error) {
    console.error("Update user status error:", error);
    throw error;
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user has any active bookings
    const activeBookings = await BookingModel.countDocuments({
      $or: [{ guide: userId }, { user: userId }],
      status: { $in: ['confirmed', 'upcoming', 'in-progress'] }
    });

    if (activeBookings > 0) {
      return res.status(httpStatus.badRequest).json({
        message: "Cannot delete user with active bookings"
      });
    }

    const user = await UserModel.findByIdAndDelete(userId);
    if (!user) {
      return res.status(httpStatus.notFound).json({
        message: "User not found"
      });
    }

    res.status(httpStatus.ok).json({
      message: "User deleted successfully"
    });
  } catch (error) {
    console.error("Delete user error:", error);
    throw error;
  }
};

const getDetailedStats = async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // User growth statistics
    const totalUsers = await UserModel.countDocuments();
    const newUsersLast30Days = await UserModel.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    const newUsersLast7Days = await UserModel.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // Guide statistics
    const totalGuides = await UserModel.countDocuments({ role: 'guide' });
    const verifiedGuides = await UserModel.countDocuments({ 
      role: 'guide', 
      verified: true,
      'guideVerification.status': 'approved'
    });
    const pendingGuides = await UserModel.countDocuments({
      role: 'guide',
      'guideVerification.status': 'pending'
    });

    // Booking statistics
    const totalBookings = await BookingModel.countDocuments();
    const completedBookings = await BookingModel.countDocuments({ status: 'completed' });
    const activeBookings = await BookingModel.countDocuments({ 
      status: { $in: ['confirmed', 'upcoming', 'in-progress'] }
    });

    // Recent activity (last 7 days)
    const recentUsers = await UserModel.find({
      createdAt: { $gte: sevenDaysAgo }
    }).select('name email role createdAt').sort({ createdAt: -1 }).limit(10);

    const recentBookings = await BookingModel.find({
      createdAt: { $gte: sevenDaysAgo }
    })
    .populate('guide', 'name')
    .populate('user', 'name')
    .sort({ createdAt: -1 })
    .limit(10);

    res.status(httpStatus.ok).json({
      message: "Detailed statistics retrieved successfully",
      stats: {
        users: {
          total: totalUsers,
          newLast30Days: newUsersLast30Days,
          newLast7Days: newUsersLast7Days,
          growthRate: totalUsers > 0 ? ((newUsersLast30Days / totalUsers) * 100).toFixed(1) : 0
        },
        guides: {
          total: totalGuides,
          verified: verifiedGuides,
          pending: pendingGuides,
          approvalRate: totalGuides > 0 ? ((verifiedGuides / totalGuides) * 100).toFixed(1) : 0
        },
        bookings: {
          total: totalBookings,
          completed: completedBookings,
          active: activeBookings,
          completionRate: totalBookings > 0 ? ((completedBookings / totalBookings) * 100).toFixed(1) : 0
        },
        recentActivity: {
          users: recentUsers,
          bookings: recentBookings
        }
      }
    });
  } catch (error) {
    console.error("Get detailed stats error:", error);
    throw error;
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  getDetailedStats
};
const { getUserById } = require("../services/user.service");
const ApiError = require("../helper/apiError");
const httpStatus = require("../util/httpStatus");
const { verifyToken } = require("../services/token.service");

// Middleware: Protect routes, requires Bearer token
const protect = async (req, res, next) => {
  let token;
  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new ApiError(
        httpStatus.unauthorized,
        "You are not logged in! Please log in to get access."
      )
    );
  }

  try {
    // Verify token and get payload
    const decoded = await verifyToken(token, "accessToken");

    // Find user in DB
    const currentUser = await getUserById(decoded._id);
    if (!currentUser) {
      return next(
        new ApiError(
          httpStatus.unauthorized,
          "The user belonging to this token no longer exists."
        )
      );
    }

    // Attach user to request for next middleware/controller
    req.user = currentUser;
    next();
  } catch (error) {
    return next(
      new ApiError(
        httpStatus.unauthorized,
        "Invalid token. Please log in again."
      )
    );
  }
};

// Middleware: Restrict to specific roles (e.g., 'guide', 'learner', 'admin')
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          httpStatus.forbidden,
          "You do not have permission to perform this action"
        )
      );
    }
    next();
  };
};

module.exports = {
  protect,
  restrictTo,
};

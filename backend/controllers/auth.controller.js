const userService = require("../services/auth.service");
const httpStatus = require("../util/httpStatus");
const tokenService = require("../services/token.service");
const emailService = require("../services/email.service");

const signUp = async (req, res) => {
  try {
    const { name, email, password, username, role } = req.body;

    console.log("SignUp request:", { name, email, username, role });

    const user = await userService.createUser({
      name,
      email,
      password,
      username,
      role,
    });

    user.password = undefined;

    console.log("User created successfully:", user);

    return res.status(httpStatus.created).json({
      message: "Account created successfully",
      user,
    });
  } catch (error) {
    console.error("SignUp error:", error);
    throw error;
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("SignIn request for email:", email);

    const user = await userService.loginUserWithEmailAndPassword(email, password);

    console.log("User authenticated:", user.email);

    const token = await tokenService.generateAuthTokens(user);
    user.password = undefined;

    console.log("Token generated successfully");

    res.status(httpStatus.ok).json({
      message: "User signed in successfully",
      token,
      user,
    });
  } catch (error) {
    console.error("SignIn error:", error);
    throw error;
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    console.log("Forgot password request for email:", email);

    const { otp, user } = await userService.sendPasswordResetOtp(email);
    
    // Send OTP via email
    await emailService.sendPasswordResetOtp(user.email, user.name, otp);

    console.log("Password reset OTP sent successfully");

    res.status(httpStatus.ok).json({
      message: "Password reset OTP sent to your email address",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    throw error;
  }
};

const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    console.log("Verify reset OTP request for email:", email);

    await userService.verifyPasswordResetOtp(email, otp);

    console.log("OTP verified successfully");

    res.status(httpStatus.ok).json({
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Verify reset OTP error:", error);
    throw error;
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    console.log("Reset password request for email:", email);

    // Verify OTP first
    await userService.verifyPasswordResetOtp(email, otp);
    
    // Reset password
    const user = await userService.resetPassword(email, newPassword);
    user.password = undefined;

    console.log("Password reset successful");

    res.status(httpStatus.ok).json({
      message: "Password reset successfully",
      user,
    });
  } catch (error) {
    console.error("Reset password error:", error);
    throw error;
  }
};

module.exports = { signUp, signIn, forgotPassword, verifyResetOtp, resetPassword };

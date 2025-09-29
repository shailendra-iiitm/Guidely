import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import auth from "../apiManger/auth";

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [email, setEmail] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Step 1: Request OTP
  const handleForgotPassword = handleSubmit(async (data) => {
    try {
      setIsLoading(true);
      await auth.forgotPassword(data);
      setEmail(data.email);
      setStep(2);
      toast.success("OTP sent to your email address!");
      reset();
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error(error.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  });

  // Step 2: Verify OTP
  const handleVerifyOtp = handleSubmit(async (data) => {
    try {
      setIsLoading(true);
      await auth.verifyResetOtp({ email, otp: data.otp });
      setStep(3);
      toast.success("OTP verified successfully!");
      reset();
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error(error.response?.data?.message || "Invalid or expired OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  });

  // Step 3: Reset Password
  const handleResetPassword = handleSubmit(async (data) => {
    try {
      setIsLoading(true);
      await auth.resetPassword({ 
        email, 
        otp: data.otp, 
        newPassword: data.newPassword 
      });
      toast.success("Password reset successfully! Please sign in with your new password.");
      // Redirect to signin page after successful reset
      window.location.href = "/signin";
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error(error.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <div className="bg-white">
      <div className="flex justify-center h-screen">
        <div className="hidden bg-cover lg:block lg:w-2/3" style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)"
        }}>
          <div className="flex items-center h-full px-20 bg-gray-900 bg-opacity-40">
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">Reset Your Password</h2>
              <p className="max-w-xl mt-3 text-gray-300">
                Don't worry, it happens to the best of us. Enter your email address and we'll send you an OTP to reset your password.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
          <div className="flex-1">
            <div className="text-center">
              <div className="flex justify-center mx-auto">
                <h1 className="text-2xl font-bold text-gray-800">🔐</h1>
              </div>
              <p className="mt-3 text-gray-500">
                {step === 1 && "Enter your email to receive an OTP"}
                {step === 2 && "Enter the OTP sent to your email"}
                {step === 3 && "Create your new password"}
              </p>
            </div>

            <div className="mt-8">
              {/* Step Progress Indicator */}
              <div className="flex justify-center mb-6">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    1
                  </div>
                  <div className={`w-12 h-1 ${step >= 2 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    2
                  </div>
                  <div className={`w-12 h-1 ${step >= 3 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    3
                  </div>
                </div>
              </div>

              {/* Step 1: Email Input */}
              {step === 1 && (
                <form onSubmit={handleForgotPassword}>
                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm text-gray-600">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className={`block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border ${
                        errors.email ? "border-red-500" : "border-gray-200"
                      } rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40`}
                      placeholder="example@example.com"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                          message: "Invalid email address",
                        },
                      })}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="mt-6">
                    <button
                      disabled={isLoading}
                      className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50 disabled:opacity-50"
                    >
                      {isLoading ? "Sending..." : "Send OTP"}
                    </button>
                  </div>
                </form>
              )}

              {/* Step 2: OTP Input */}
              {step === 2 && (
                <form onSubmit={handleVerifyOtp}>
                  <div>
                    <label htmlFor="otp" className="block mb-2 text-sm text-gray-600">
                      Enter 6-digit OTP
                    </label>
                    <p className="mb-3 text-sm text-gray-500">
                      OTP sent to: {email}
                    </p>
                    <input
                      type="text"
                      maxLength="6"
                      className={`block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border ${
                        errors.otp ? "border-red-500" : "border-gray-200"
                      } rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 text-center text-lg tracking-widest`}
                      placeholder="123456"
                      {...register("otp", {
                        required: "OTP is required",
                        pattern: {
                          value: /^[0-9]{6}$/,
                          message: "OTP must be 6 digits",
                        },
                      })}
                    />
                    {errors.otp && (
                      <p className="text-sm text-red-500">{errors.otp.message}</p>
                    )}
                  </div>

                  <div className="mt-6">
                    <button
                      disabled={isLoading}
                      className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50 disabled:opacity-50"
                    >
                      {isLoading ? "Verifying..." : "Verify OTP"}
                    </button>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-full px-4 py-2 text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-50 focus:outline-none"
                    >
                      Back to Email
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: New Password */}
              {step === 3 && (
                <form onSubmit={handleResetPassword}>
                  <div>
                    <label htmlFor="otp" className="block mb-2 text-sm text-gray-600">
                      Re-enter OTP
                    </label>
                    <input
                      type="text"
                      maxLength="6"
                      className={`block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border ${
                        errors.otp ? "border-red-500" : "border-gray-200"
                      } rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 text-center text-lg tracking-widest`}
                      placeholder="123456"
                      {...register("otp", {
                        required: "OTP is required",
                        pattern: {
                          value: /^[0-9]{6}$/,
                          message: "OTP must be 6 digits",
                        },
                      })}
                    />
                    {errors.otp && (
                      <p className="text-sm text-red-500">{errors.otp.message}</p>
                    )}
                  </div>

                  <div className="mt-4">
                    <label htmlFor="newPassword" className="block mb-2 text-sm text-gray-600">
                      New Password
                    </label>
                    <input
                      type="password"
                      className={`block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border ${
                        errors.newPassword ? "border-red-500" : "border-gray-200"
                      } rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40`}
                      placeholder="Enter new password"
                      {...register("newPassword", {
                        required: "New password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters long",
                        },
                      })}
                    />
                    {errors.newPassword && (
                      <p className="text-sm text-red-500">{errors.newPassword.message}</p>
                    )}
                  </div>

                  <div className="mt-4">
                    <label htmlFor="confirmPassword" className="block mb-2 text-sm text-gray-600">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className={`block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border ${
                        errors.confirmPassword ? "border-red-500" : "border-gray-200"
                      } rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40`}
                      placeholder="Confirm new password"
                      {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value, { newPassword }) =>
                          value === newPassword || "Passwords do not match",
                      })}
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <div className="mt-6">
                    <button
                      disabled={isLoading}
                      className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50 disabled:opacity-50"
                    >
                      {isLoading ? "Resetting..." : "Reset Password"}
                    </button>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-full px-4 py-2 text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-50 focus:outline-none"
                    >
                      Back to OTP
                    </button>
                  </div>
                </form>
              )}

              <p className="mt-6 text-sm text-center text-gray-400">
                Remember your password?{" "}
                <NavLink
                  to="/signin"
                  className="text-blue-500 focus:outline-none focus:underline hover:underline"
                >
                  Sign in
                </NavLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import auth from "../apiManger/auth"; // Import your auth API manager
import toast from "react-hot-toast"; // For notifications

const SignUp = () => {
  const { role } = useParams(); // Use params to get the role
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // DYNAMIC heading & intro text based on role
  const heading =
    role === "guide"
      ? "Sign Up as Guide"
      : "Sign Up as Learner";
  const intro =
    role === "guide"
      ? "Join Guidely as a Guide and start empowering learners to achieve their goals."
      : "Create your learner account to start learning with our best guides.";

  // Initialize useForm
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Function to handle form submission
  const onSubmit = async (data) => {
    setIsLoading(true);
    const formData = {
      ...data,
      role, // Add role to form data
    };
    try {
      await auth.signup(formData); // Adjust your API call as necessary
      reset();
      toast.success("Account created successfully.");
      navigate("/signin");
    } catch (error) {
      console.error("Error during signup:", error);
      toast.error("Failed to sign up.");
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-white ">
      {/* Home Button */}
      <div className="absolute top-4 left-4 z-10">
        <NavLink
          to="/"
          className="flex items-center px-4 py-2 text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors duration-300 shadow-lg"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          Home
        </NavLink>
      </div>
      <div className="flex justify-center h-screen">
        <div className="hidden bg-[url('https://images.unsplash.com/photo-1616763355603-9755a640a287?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80')] bg-cover lg:block lg:w-2/3">
          <div className="flex items-center w-full h-full px-20 bg-gray-900 bg-opacity-40">
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Guidely
              </h2>
              <p className="max-w-xl mt-3 text-gray-300">
                {intro}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
          <div className="flex-1">
            <div className="text-center">
              <div className="flex justify-center mx-auto"></div>
              <h1 className="text-4xl font-bold">{heading}</h1>
              <p className="mt-3 text-gray-500">
                Sign up to create your account
              </p>
            </div>

            <div className="mt-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name Field */}
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className={`block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border ${
                      errors.name ? "border-red-500" : "border-gray-200"
                    } rounded-lg  focus:border-blue-400 focus:ring focus:ring-blue-400 focus:outline-none focus:ring-opacity-40`}
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    className={`block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border ${
                      errors.email ? "border-red-500" : "border-gray-200"
                    } rounded-lg focus:border-blue-400 focus:ring focus:ring-blue-400 focus:outline-none focus:ring-opacity-40`}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Username Field */}
                <div>
                  <input
                    type="text"
                    placeholder="Username"
                    className={`block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border ${
                      errors.username ? "border-red-500" : "border-gray-200"
                    } rounded-lg focus:border-blue-400 focus:ring focus:ring-blue-400 focus:outline-none focus:ring-opacity-40`}
                    {...register("username", {
                      required: "Username is required",
                      minLength: {
                        value: 4,
                        message: "Username must be at least 4 characters long",
                      },
                    })}
                  />
                  {errors.username && (
                    <p className="text-sm text-red-500">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    className={`block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border ${
                      errors.password ? "border-red-500" : "border-gray-200"
                    } rounded-lg focus:border-blue-400 focus:ring focus:ring-blue-400 focus:outline-none focus:ring-opacity-40`}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters long",
                      },
                    })}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="mt-6">
                  <button
                    disabled={isLoading}
                    className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50 disabled:opacity-50"
                  >
                    {isLoading ? "Loading..." : "Sign Up"}
                  </button>
                </div>
              </form>

              <p className="mt-6 text-sm text-center text-gray-400">
                Already have an account?{" "}
                <NavLink
                  to="/signin"
                  className="text-blue-500 focus:outline-none focus:underline hover:underline"
                >
                  Sign In
                </NavLink>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

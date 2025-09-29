import AxiosInstances from ".";

const signup = (data) => {
  return AxiosInstances.post("/auth/signup", data);
};

const signin = (data) => {
  return AxiosInstances.post("/auth/signin", data);
};

const forgotPassword = (data) => {
  return AxiosInstances.post("/auth/forgot-password", data);
};

const verifyResetOtp = (data) => {
  return AxiosInstances.post("/auth/verify-reset-otp", data);
};

const resetPassword = (data) => {
  return AxiosInstances.post("/auth/reset-password", data);
};

export default { 
  signup, 
  signin, 
  forgotPassword, 
  verifyResetOtp, 
  resetPassword 
};

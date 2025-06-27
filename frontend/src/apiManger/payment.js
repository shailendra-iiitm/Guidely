// frontend/src/apiManger/payment.js

import AxiosInstance from ".";

// Get payment history for current user
const getPaymentHistory = async () => {
  return await AxiosInstance.get("/payment/history");
};

// Get payment details by ID
const getPaymentById = async (paymentId) => {
  return await AxiosInstance.get(`/payment/${paymentId}`);
};

// Get earnings for guides
const getEarnings = async () => {
  return await AxiosInstance.get("/payment/earnings");
};

// Get payment statistics
const getPaymentStats = async () => {
  return await AxiosInstance.get("/payment/stats");
};

export default {
  getPaymentHistory,
  getPaymentById,
  getEarnings,
  getPaymentStats
};

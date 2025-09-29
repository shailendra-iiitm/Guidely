import AxiosInstances from ".";

const getAllUsers = (params = {}) => {
  return AxiosInstances.get("/admin/users", { params });
};

const getUserById = (userId) => {
  return AxiosInstances.get(`/admin/users/${userId}`);
};

const updateUserStatus = (userId, data) => {
  return AxiosInstances.patch(`/admin/users/${userId}/status`, data);
};

const deleteUser = (userId) => {
  return AxiosInstances.delete(`/admin/users/${userId}`);
};

const getSystemLogs = (params = {}) => {
  return AxiosInstances.get("/admin/logs", { params });
};

const getDetailedStats = () => {
  return AxiosInstances.get("/admin/detailed-stats");
};

const getBookingStats = () => {
  return AxiosInstances.get("/admin/booking-stats");
};

const getRevenueStats = () => {
  return AxiosInstances.get("/admin/revenue-stats");
};

export default { 
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  getSystemLogs,
  getDetailedStats,
  getBookingStats,
  getRevenueStats
};
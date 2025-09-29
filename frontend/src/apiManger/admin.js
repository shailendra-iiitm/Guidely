import AxiosInstances from ".";

const getDashboard = () => {
  return AxiosInstances.get("/admin/dashboard");
};

const initAdmin = () => {
  return AxiosInstances.post("/admin/init-admin");
};

export default { 
  getDashboard, 
  initAdmin 
};
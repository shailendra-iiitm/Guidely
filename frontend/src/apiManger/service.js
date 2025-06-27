import AxiosInstances from ".";

const createService = async (data) => {
  return await AxiosInstances.post("/service", data);
};

const getAllServices = async () => {
  return await AxiosInstances.get("/service");
};

const editService = async (id, data) => {
  return await AxiosInstances.put("/service/" + id, data);
};

const toggleServiceStatus = async (id, active) => {
  return await AxiosInstances.put("/service/" + id, { active });
};

const getServiceById = async (id) => {
  return await AxiosInstances.get(`/service/${id}`);
};

export default { getAllServices, createService, editService, toggleServiceStatus, getServiceById };

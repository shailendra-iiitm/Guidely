import AxiosInstances from ".";

const getGuideAvailability = async (guideId, duration) => {
  return await AxiosInstances.get(
    `availability/${guideId}?duration=${duration}`
  );
};

const createAvailability = async (availabilityData) => {
  return await AxiosInstances.post("availability", availabilityData);
};

const updateAvailability = async (availabilityData) => {
  return await AxiosInstances.put("availability", availabilityData);
};

const getMyAvailability = async () => {
  return await AxiosInstances.get("availability");
};

export default { 
  getGuideAvailability, 
  createAvailability, 
  updateAvailability, 
  getMyAvailability 
};

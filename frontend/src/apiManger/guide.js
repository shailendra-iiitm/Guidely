import AxiosInstances from ".";

// Define the functions
const getAllGuides = () => {
  return AxiosInstances.get("/guide");
};

const getGuideByUsername = (userName) => {
  return AxiosInstances.get("/guide/" + userName);
};

// Assign the object to a variable
const guideAPI = {
  getAllGuides,
  getGuideByUsername,
};

// Export the variable as default
export default guideAPI;


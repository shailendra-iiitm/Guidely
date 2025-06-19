import AxiosInstances from ".";

// Book a service (used by learner)
const bookService = async (data) => {
  return await AxiosInstances.post("/booking/initiate-booking", data);
};

// Get bookings for a guide (was mentor)
const getGuideBookings = async () => {
  return await AxiosInstances.get("/booking/guide");
};

// Get bookings for a learner (was student)
const getLearnerBookings = async () => {
  return await AxiosInstances.get("/booking/");
};

const bookingAPI = {
  bookService,
  getGuideBookings,
  getLearnerBookings,
};

export default bookingAPI;

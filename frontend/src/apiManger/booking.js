import AxiosInstance from ".";

// Book a service (used by learner)
const bookService = async (data) => {
  return await AxiosInstance.post("/booking/initiate-booking", data);
};

// Get bookings for a guide (was mentor)
const getGuideBookings = async () => {
  return await AxiosInstance.get("/booking/guide");
};

// Get bookings for a learner (was student)
const getLearnerBookings = async () => {
  return await AxiosInstance.get("/booking/");
};

// Update meeting link (guides only)
const updateMeetingLink = async (bookingId, meetingLink) => {
  return await AxiosInstance.put("/booking/meeting-link", {
    bookingId,
    meetingLink
  });
};

// Mark session as complete (guides only)
const markSessionComplete = async (bookingId, sessionNotes, achievements) => {
  return await AxiosInstance.put("/booking/complete", {
    bookingId,
    sessionNotes,
    achievements
  });
};

// Rate a session (learners only)
const rateSession = async (bookingId, rating, comment) => {
  return await AxiosInstance.put("/booking/rate", {
    bookingId,
    rating,
    comment
  });
};

// Start a session
const startSession = async (bookingId) => {
  return await AxiosInstance.put("/booking/start", {
    bookingId
  });
};

// Confirm a booking (guides only)
const confirmBooking = async (bookingId, meetingLink) => {
  return await AxiosInstance.put("/booking/confirm", {
    bookingId,
    meetingLink
  });
};

// Reschedule a booking (guides only)
const rescheduleBooking = async (bookingId, newDateTime, reason) => {
  return await AxiosInstance.put("/booking/reschedule", {
    bookingId,
    newDateTime,
    reason
  });
};

// Cancel a booking
const cancelBooking = async (bookingId, reason) => {
  return await AxiosInstance.put("/booking/cancel", {
    bookingId,
    reason
  });
};

// Add detailed feedback (learners only)
const addFeedback = async (bookingId, feedback, suggestions, highlights) => {
  return await AxiosInstance.put("/booking/feedback", {
    bookingId,
    feedback,
    suggestions,
    highlights
  });
};

// Get booking details
const getBookingDetails = async (bookingId) => {
  return await AxiosInstance.get(`/booking/${bookingId}`);
};

const bookingAPI = {
  bookService,
  getGuideBookings,
  getLearnerBookings,
  updateMeetingLink,
  markSessionComplete,
  rateSession,
  startSession,
  confirmBooking,
  rescheduleBooking,
  cancelBooking,
  addFeedback,
  getBookingDetails,
};

export default bookingAPI;

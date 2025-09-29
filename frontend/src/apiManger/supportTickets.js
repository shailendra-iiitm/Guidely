import API from "./index";

const supportTickets = {
  // Create a new support ticket
  createTicket: async (ticketData) => {
    const response = await API.post("/support-tickets", ticketData);
    return response.data;
  },

  // Get user's tickets
  getMyTickets: async (params = {}) => {
    const response = await API.get("/support-tickets/my-tickets", { params });
    return response.data;
  },

  // Get all tickets (Admin only)
  getAllTickets: async (params = {}) => {
    const response = await API.get("/support-tickets", { params });
    return response.data;
  },

  // Get ticket by ID
  getTicketById: async (ticketId) => {
    const response = await API.get(`/support-tickets/${ticketId}`);
    return response.data;
  },

  // Add message to ticket
  addMessage: async (ticketId, messageData) => {
    const response = await API.post(`/support-tickets/${ticketId}/messages`, messageData);
    return response.data;
  },

  // Update ticket status (Admin only)
  updateTicketStatus: async (ticketId, updateData) => {
    const response = await API.patch(`/support-tickets/${ticketId}/status`, updateData);
    return response.data;
  },

  // Get ticket statistics (Admin only)
  getTicketStats: async (params = {}) => {
    const response = await API.get("/support-tickets/admin/stats", { params });
    return response.data;
  },

  // Delete ticket (Admin only)
  deleteTicket: async (ticketId) => {
    const response = await API.delete(`/support-tickets/${ticketId}`);
    return response.data;
  }
};

export default supportTickets;
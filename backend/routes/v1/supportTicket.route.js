const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../../middleware/auth');
const {
  createTicket,
  getAllTickets,
  getMyTickets,
  getTicketById,
  updateTicketStatus,
  addMessage,
  getTicketStats,
  deleteTicket
} = require('../../controllers/supportTicket.controller');

// User routes
router.post('/', protect, createTicket);
router.get('/my-tickets', protect, getMyTickets);
router.get('/:id', protect, getTicketById);
router.post('/:id/messages', protect, addMessage);

// Admin routes
router.get('/', protect, adminOnly, getAllTickets);
router.patch('/:id/status', protect, adminOnly, updateTicketStatus);
router.get('/admin/stats', protect, adminOnly, getTicketStats);
router.delete('/:id', protect, adminOnly, deleteTicket);

module.exports = router;
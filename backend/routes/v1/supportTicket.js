const express = require('express');
const auth = require('../../middleware/auth');
const supportTicketController = require('../../controllers/supportTicket.controller');

const router = express.Router();

// Public routes (authenticated users)
router.post('/', auth('user'), supportTicketController.createTicket);
router.get('/my-tickets', auth('user'), supportTicketController.getUserTickets);
router.get('/:id', auth('user'), supportTicketController.getTicketById);
router.post('/:id/messages', auth('user'), supportTicketController.addMessage);

// Admin only routes
router.get('/', auth('admin'), supportTicketController.getAllTickets);
router.patch('/:id/status', auth('admin'), supportTicketController.updateTicketStatus);
router.get('/admin/stats', auth('admin'), supportTicketController.getTicketStats);
router.delete('/:id', auth('admin'), supportTicketController.deleteTicket);

module.exports = router;
const SupportTicket = require('../models/supportTicket.model');
const User = require('../models/user.model');

// Create a new support ticket
const createTicket = async (req, res) => {
  try {
    const { subject, description, category, priority, attachments } = req.body;
    
    const ticket = new SupportTicket({
      user: req.user._id,
      subject,
      description,
      category,
      priority,
      attachments: attachments || [],
      messages: [{
        sender: req.user._id,
        senderType: 'user',
        message: description,
        timestamp: new Date()
      }]
    });

    await ticket.save();
    await ticket.populate('user', 'name email username');

    res.status(201).json({
      success: true,
      message: 'Support ticket created successfully',
      data: ticket
    });
  } catch (error) {
    console.error('Error creating support ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create support ticket',
      error: error.message
    });
  }
};

// Get all tickets for admin
const getAllTickets = async (req, res) => {
  try {
    const { status, category, priority, assignedTo, search, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (search) {
      filter.$or = [
        { subject: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { ticketId: { $regex: search, $options: 'i' } }
      ];
    }

    const tickets = await SupportTicket.find(filter)
      .populate('user', 'name email username')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await SupportTicket.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        tickets,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch support tickets',
      error: error.message
    });
  }
};

// Get user's own tickets
const getMyTickets = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const filter = { user: req.user._id };
    if (status) filter.status = status;

    const tickets = await SupportTicket.find(filter)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await SupportTicket.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        tickets,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching user tickets:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your tickets',
      error: error.message
    });
  }
};

// Get single ticket details
const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const ticket = await SupportTicket.findById(id)
      .populate('user', 'name email username')
      .populate('assignedTo', 'name email')
      .populate('messages.sender', 'name email username');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Support ticket not found'
      });
    }

    // Check if user can access this ticket
    if (req.user.role !== 'admin' && ticket.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ticket',
      error: error.message
    });
  }
};

// Update ticket status (Admin only)
const updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedTo, internalNotes } = req.body;
    
    const updateData = {};
    if (status) updateData.status = status;
    if (assignedTo) updateData.assignedTo = assignedTo;
    if (internalNotes) updateData.internalNotes = internalNotes;

    // Set resolution time if status is being set to resolved
    if (status === 'resolved' && !updateData.resolvedAt) {
      updateData.resolvedAt = new Date();
    }

    const ticket = await SupportTicket.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('user', 'name email username')
     .populate('assignedTo', 'name email');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Support ticket not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Ticket updated successfully',
      data: ticket
    });
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update ticket',
      error: error.message
    });
  }
};

// Add message to ticket
const addMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { message, isInternal = false } = req.body;
    
    const ticket = await SupportTicket.findById(id);
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Support ticket not found'
      });
    }

    // Check if user can add message to this ticket
    if (req.user.role !== 'admin' && ticket.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const newMessage = {
      sender: req.user._id,
      senderType: req.user.role === 'admin' ? 'admin' : 'user',
      message,
      isInternal: req.user.role === 'admin' ? isInternal : false,
      timestamp: new Date()
    };

    ticket.messages.push(newMessage);
    ticket.lastResponseAt = new Date();
    
    // If admin responds, update status to in-progress if it was open
    if (req.user.role === 'admin' && ticket.status === 'open') {
      ticket.status = 'in-progress';
    }

    await ticket.save();
    await ticket.populate('messages.sender', 'name email username');

    res.status(200).json({
      success: true,
      message: 'Message added successfully',
      data: ticket
    });
  } catch (error) {
    console.error('Error adding message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add message',
      error: error.message
    });
  }
};

// Get ticket statistics (Admin only)
const getTicketStats = async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    switch (period) {
      case '7d':
        dateFilter = { createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } };
        break;
      case '30d':
        dateFilter = { createdAt: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } };
        break;
      case '90d':
        dateFilter = { createdAt: { $gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) } };
        break;
      default:
        dateFilter = {};
    }

    const [
      totalTickets,
      openTickets,
      inProgressTickets,
      resolvedTickets,
      closedTickets,
      ticketsByCategory,
      ticketsByPriority,
      avgResponseTime
    ] = await Promise.all([
      SupportTicket.countDocuments(dateFilter),
      SupportTicket.countDocuments({ ...dateFilter, status: 'open' }),
      SupportTicket.countDocuments({ ...dateFilter, status: 'in-progress' }),
      SupportTicket.countDocuments({ ...dateFilter, status: 'resolved' }),
      SupportTicket.countDocuments({ ...dateFilter, status: 'closed' }),
      SupportTicket.aggregate([
        { $match: dateFilter },
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]),
      SupportTicket.aggregate([
        { $match: dateFilter },
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ]),
      SupportTicket.aggregate([
        { $match: { ...dateFilter, resolvedAt: { $exists: true } } },
        { $project: { responseTime: { $subtract: ['$resolvedAt', '$createdAt'] } } },
        { $group: { _id: null, avgTime: { $avg: '$responseTime' } } }
      ])
    ]);

    const stats = {
      total: totalTickets,
      open: openTickets,
      inProgress: inProgressTickets,
      resolved: resolvedTickets,
      closed: closedTickets,
      byCategory: ticketsByCategory,
      byPriority: ticketsByPriority,
      avgResponseTimeHours: avgResponseTime[0] ? Math.round(avgResponseTime[0].avgTime / (1000 * 60 * 60)) : 0
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching ticket stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ticket statistics',
      error: error.message
    });
  }
};

// Delete ticket (Admin only)
const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    
    const ticket = await SupportTicket.findByIdAndDelete(id);
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Support ticket not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Support ticket deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete ticket',
      error: error.message
    });
  }
};

module.exports = {
  createTicket,
  getAllTickets,
  getMyTickets,
  getTicketById,
  updateTicketStatus,
  addMessage,
  getTicketStats,
  deleteTicket
};

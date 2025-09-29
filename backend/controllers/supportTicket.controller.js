const httpStatus = require('../util/httpStatus');
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

    res.status(httpStatus.CREATED).json({
      success: true,
      message: 'Support ticket created successfully',
      data: ticket
    });
  } catch (error) {
    console.error('Error creating support ticket:', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to create support ticket',
      error: error.message
    });
  }
};

// Delete ticket (Admin only)
const deleteTicket = async (req, res) => {
  try { } = req.body;
    
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

    res.status(httpStatus.CREATED).json({
      success: true,
      message: 'Support ticket created successfully',
      data: ticket
    });
  } catch (error) {
    console.error('Error creating support ticket:', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to create support ticket',
      error: error.message
    });
  }
};

// Get all tickets (Admin only)
const getAllTickets = async (req, res) => {
  try {
  const {
    page = 1,
    limit = 10,
    status,
    priority,
    category,
    assignedTo,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  const filter = {};
  
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (category) filter.category = category;
  if (assignedTo) filter.assignedTo = assignedTo;
  
  if (search) {
    filter.$or = [
      { subject: { $regex: search, $options: 'i' } },
      { ticketId: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const tickets = await SupportTicket.find(filter)
    .populate('user', 'name email username role')
    .populate('assignedTo', 'name email')
    .populate('messages.sender', 'name email role')
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await SupportTicket.countDocuments(filter);

  res.json({
    success: true,
    data: {
      tickets,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch tickets',
      error: error.message
    });
  }
};

// Get user's tickets
const getUserTickets = async (req, res) => {
  try {
  const { page = 1, limit = 10, status } = req.query;
  
  const filter = { user: req.user._id };
  if (status) filter.status = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const tickets = await SupportTicket.find(filter)
    .populate('assignedTo', 'name email')
    .populate('messages.sender', 'name email role')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await SupportTicket.countDocuments(filter);

  res.json({
    success: true,
    data: {
      tickets,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  });
  } catch (error) {
    console.error('Error fetching user tickets:', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch user tickets',
      error: error.message
    });
  }
};

// Get ticket by ID
const getTicketById = async (req, res) => {
  try {
  const { id } = req.params;
  
  const filter = { _id: id };
  
  // If not admin, only allow user to see their own tickets
  if (req.user.role !== 'admin') {
    filter.user = req.user._id;
  }

  const ticket = await SupportTicket.findOne(filter)
    .populate('user', 'name email username role')
    .populate('assignedTo', 'name email')
    .populate('messages.sender', 'name email role');

  if (!ticket) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ticket not found');
  }

  res.json({
    success: true,
    data: ticket
  });
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
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
  const { status, assignedTo, priority, tags } = req.body;

  const ticket = await SupportTicket.findById(id);
  if (!ticket) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ticket not found');
  }

  if (status) ticket.status = status;
  if (assignedTo) ticket.assignedTo = assignedTo;
  if (priority) ticket.priority = priority;
  if (tags) ticket.tags = tags;

  await ticket.save();
  await ticket.populate('user', 'name email username');
  await ticket.populate('assignedTo', 'name email');

  res.json({
    success: true,
    message: 'Ticket updated successfully',
    data: ticket
  });
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
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
  const { message, attachments } = req.body;

  const filter = { _id: id };
  
  // If not admin, only allow user to add message to their own tickets
  if (req.user.role !== 'admin') {
    filter.user = req.user._id;
  }

  const ticket = await SupportTicket.findOne(filter);
  if (!ticket) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ticket not found');
  }

  const newMessage = {
    sender: req.user._id,
    senderType: req.user.role === 'admin' ? 'admin' : 'user',
    message,
    attachments: attachments || [],
    timestamp: new Date()
  };

  ticket.messages.push(newMessage);
  
  // If ticket was closed/resolved and user adds message, reopen it
  if (req.user.role !== 'admin' && (ticket.status === 'closed' || ticket.status === 'resolved')) {
    ticket.status = 'open';
  }

  await ticket.save();
  await ticket.populate('messages.sender', 'name email role');

  res.json({
    success: true,
    message: 'Message added successfully',
    data: ticket
  });
  } catch (error) {
    console.error('Error adding message:', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
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
    case '1y':
      dateFilter = { createdAt: { $gte: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000) } };
      break;
    default:
      dateFilter = {};
  }

  const [
    totalTickets,
    statusStats,
    priorityStats,
    categoryStats,
    recentTickets,
    avgResponseTime,
    avgResolutionTime
  ] = await Promise.all([
    SupportTicket.countDocuments(),
    SupportTicket.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]),
    SupportTicket.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]),
    SupportTicket.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]),
    SupportTicket.find(dateFilter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10),
    SupportTicket.aggregate([
      { $match: { ...dateFilter, responseTime: { $ne: null } } },
      { $group: { _id: null, avgResponseTime: { $avg: '$responseTime' } } }
    ]),
    SupportTicket.aggregate([
      { $match: { ...dateFilter, resolutionTime: { $ne: null } } },
      { $group: { _id: null, avgResolutionTime: { $avg: '$resolutionTime' } } }
    ])
  ]);

  res.json({
    success: true,
    data: {
      overview: {
        totalTickets,
        newTicketsThisPeriod: await SupportTicket.countDocuments(dateFilter)
      },
      statusStats,
      priorityStats,
      categoryStats,
      recentTickets,
      metrics: {
        avgResponseTime: avgResponseTime[0]?.avgResponseTime || 0,
        avgResolutionTime: avgResolutionTime[0]?.avgResolutionTime || 0
      }
    }
  });
});

// Delete ticket (Admin only)
const deleteTicket = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const ticket = await SupportTicket.findById(id);
  if (!ticket) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ticket not found');
  }

  await SupportTicket.findByIdAndDelete(id);

  res.json({
    success: true,
    message: 'Ticket deleted successfully'
  });
});

module.exports = {
  createTicket,
  getAllTickets,
  getUserTickets,
  getTicketById,
  updateTicketStatus,
  addMessage,
  getTicketStats,
  deleteTicket
};
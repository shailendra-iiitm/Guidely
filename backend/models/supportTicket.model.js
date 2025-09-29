const mongoose = require('mongoose');

const supportTicketSchema = mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      enum: ['general', 'technical', 'billing', 'booking', 'account', 'other'],
      default: 'general'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'resolved', 'closed'],
      default: 'open'
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    messages: [{
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      senderType: {
        type: String,
        enum: ['user', 'admin'],
        required: true
      },
      message: {
        type: String,
        required: true,
        trim: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      },
      attachments: [{
        filename: String,
        url: String,
        fileType: String
      }]
    }],
    attachments: [{
      filename: String,
      url: String,
      fileType: String
    }],
    tags: [String],
    resolvedAt: {
      type: Date,
      default: null
    },
    closedAt: {
      type: Date,
      default: null
    },
    lastResponseAt: {
      type: Date,
      default: Date.now
    },
    responseTime: {
      type: Number, // in minutes
      default: null
    },
    resolutionTime: {
      type: Number, // in minutes
      default: null
    }
  },
  {
    timestamps: true,
  }
);

// Generate unique ticket ID
supportTicketSchema.pre('save', async function (next) {
  if (!this.ticketId) {
    const count = await this.constructor.countDocuments();
    this.ticketId = `TKT-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Update response time when a message is added
supportTicketSchema.pre('save', function (next) {
  if (this.isModified('messages') && this.messages.length > 0) {
    this.lastResponseAt = new Date();
    
    // Calculate response time for first admin response
    if (!this.responseTime) {
      const firstAdminMessage = this.messages.find(msg => msg.senderType === 'admin');
      if (firstAdminMessage) {
        const diffInMinutes = Math.floor((firstAdminMessage.timestamp - this.createdAt) / (1000 * 60));
        this.responseTime = diffInMinutes;
      }
    }
  }
  next();
});

// Update resolution time when status changes to resolved
supportTicketSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    if (this.status === 'resolved' && !this.resolvedAt) {
      this.resolvedAt = new Date();
      const diffInMinutes = Math.floor((this.resolvedAt - this.createdAt) / (1000 * 60));
      this.resolutionTime = diffInMinutes;
    } else if (this.status === 'closed' && !this.closedAt) {
      this.closedAt = new Date();
    }
  }
  next();
});

// Indexes for better query performance
supportTicketSchema.index({ user: 1, status: 1 });
supportTicketSchema.index({ status: 1, priority: 1 });
supportTicketSchema.index({ assignedTo: 1, status: 1 });
supportTicketSchema.index({ createdAt: -1 });
supportTicketSchema.index({ ticketId: 1 });

module.exports = mongoose.model('SupportTicket', supportTicketSchema);
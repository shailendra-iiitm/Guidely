const mongoose = require('mongoose');
const SupportTicket = require('./models/supportTicket.model');
const User = require('./models/user.model');
require('dotenv').config();

const MONGODB_URI = process.env.DB_URL || 'mongodb://localhost:27017/guidely';

async function testSupportTickets() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if there are any support tickets
    const ticketCount = await SupportTicket.countDocuments();
    console.log(`Total support tickets in database: ${ticketCount}`);

    if (ticketCount > 0) {
      const tickets = await SupportTicket.find()
        .populate('user', 'name email username')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 })
        .limit(5);
      
      console.log('Recent tickets:');
      tickets.forEach((ticket, index) => {
        console.log(`${index + 1}. ${ticket.ticketId} - ${ticket.subject} (${ticket.status})`);
      });
    } else {
      console.log('No support tickets found in database');
      
      // Check if there are any users to create a test ticket
      const userCount = await User.countDocuments();
      console.log(`Total users in database: ${userCount}`);
      
      if (userCount > 0) {
        const testUser = await User.findOne();
        console.log(`Found test user: ${testUser.name} (${testUser.email})`);
        
        // Create a test support ticket
        const testTicket = new SupportTicket({
          user: testUser._id,
          subject: 'Test Support Ticket',
          description: 'This is a test support ticket created for debugging',
          category: 'technical',
          priority: 'medium',
          messages: [{
            sender: testUser._id,
            senderType: 'user',
            message: 'This is a test support ticket created for debugging',
            timestamp: new Date()
          }]
        });
        
        await testTicket.save();
        console.log(`Created test ticket: ${testTicket.ticketId}`);
      } else {
        console.log('No users found in database - cannot create test ticket');
      }
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testSupportTickets();
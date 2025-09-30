require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const bookingService = require('./services/booking.service');
const PORT = process.env.PORT || 9000;
const MONGODB_URI = process.env.DB_URL || 'mongodb://localhost:27017/guidely';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`));
    
    // Set up periodic booking status updates every 5 minutes
    setInterval(async () => {
      try {
        console.log('Running periodic booking status update...');
        await bookingService.updateBookingStatuses();
      } catch (error) {
        console.error('Error in periodic status update:', error);
      }
    }, 5 * 60 * 1000); // 5 minutes
    
    // Run initial status update
    setTimeout(async () => {
      try {
        console.log('Running initial booking status update...');
        await bookingService.updateBookingStatuses();
      } catch (error) {
        console.error('Error in initial status update:', error);
      }
    }, 5000); // 5 seconds after startup
  })
  .catch(err => console.error('MongoDB connection error:', err));

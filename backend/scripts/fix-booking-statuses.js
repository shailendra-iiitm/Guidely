// backend/scripts/fix-booking-statuses.js
// Run this script to fix existing bookings that are stuck in pending status

const mongoose = require("mongoose");
const BookingModel = require("../models/booking.model");
const config = require("../config");

async function fixBookingStatuses() {
  try {
    // Connect to database
    await mongoose.connect(config.db.uri);
    console.log("Connected to database");

    const now = new Date();
    const oneHourAgo = new Date(now - 1 * 60 * 60 * 1000);
    
    console.log("Current time:", now);
    console.log("One hour ago:", oneHourAgo);
    
    // Find all bookings
    const allBookings = await BookingModel.find({}).populate('service', 'name price');
    console.log("Total bookings found:", allBookings.length);
    
    let updated = 0;
    
    for (const booking of allBookings) {
      const bookingDate = new Date(booking.dateAndTime);
      const hoursDiff = (bookingDate - now) / (1000 * 60 * 60);
      
      console.log(`Booking ${booking._id}: ${booking.status}, scheduled for ${bookingDate}, hours diff: ${hoursDiff.toFixed(2)}`);
      
      let newStatus = booking.status;
      
      // If it's pending and the price is 0 (free session), mark as confirmed
      if (booking.status === 'pending' && (booking.price === 0 || booking.service?.price === 0)) {
        newStatus = 'confirmed';
        console.log(`  -> Updating to confirmed (free session)`);
      }
      // If it's pending and has passed, mark as no-show
      else if (booking.status === 'pending' && hoursDiff < -1) {
        newStatus = 'no-show';
        console.log(`  -> Updating to no-show (past pending)`);
      }
      // If it's confirmed and has passed, mark as completed
      else if ((booking.status === 'confirmed' || booking.status === 'upcoming') && hoursDiff < -1) {
        newStatus = 'completed';
        console.log(`  -> Updating to completed (past confirmed)`);
      }
      
      if (newStatus !== booking.status) {
        await BookingModel.findByIdAndUpdate(booking._id, { 
          status: newStatus,
          ...(newStatus === 'completed' && !booking.sessionEndedAt ? { sessionEndedAt: new Date() } : {})
        });
        updated++;
        console.log(`  ✓ Updated booking ${booking._id} from ${booking.status} to ${newStatus}`);
      }
    }
    
    console.log(`\nSummary: Updated ${updated} out of ${allBookings.length} bookings`);
    
    // Show final status distribution
    const statusCounts = await BookingModel.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    console.log("\nFinal status distribution:");
    statusCounts.forEach(({ _id, count }) => {
      console.log(`  ${_id}: ${count}`);
    });
    
  } catch (error) {
    console.error("Error fixing booking statuses:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from database");
  }
}

// Run the script
if (require.main === module) {
  fixBookingStatuses().catch(console.error);
}

module.exports = { fixBookingStatuses };

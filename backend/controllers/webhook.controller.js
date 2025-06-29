const razorpay = require("razorpay");
const crypto = require("crypto");
const config = require("../config");
const httpStatus = require("../util/httpStatus");
const bookingService = require("../services/booking.service");
const zoomService = require("../services/zoom.service");
const emailService = require("../services/email.service");
const moment = require("moment");

const handleRazorpayWebhook = async (req, res, next) => {
  try {
    console.log('=== WEBHOOK RECEIVED ===');
    console.log('Headers:', req.headers);
    console.log('Body:', JSON.stringify(req.body, null, 2));
    
    // Verify webhook signature for security
    const webhookSignature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    if (webhookSecret && webhookSignature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(req.body))
        .digest('hex');
      
      if (expectedSignature !== webhookSignature) {
        console.error('Webhook signature verification failed');
        return res.status(httpStatus.UNAUTHORIZED).json({
          error: 'Webhook signature verification failed'
        });
      }
    }

    const { event, payload } = req.body;
    console.log('=== PROCESSING EVENT ===', event);
    
    // Handle different payment events
    if (event === "payment.captured" || event === "order.paid") {
      let bookingId;
      
      // Extract booking ID from different possible locations
      if (payload?.payment?.entity?.notes?.bookingId) {
        bookingId = payload.payment.entity.notes.bookingId;
      } else if (payload?.order?.entity?.notes?.bookingId) {
        bookingId = payload.order.entity.notes.bookingId;
      }
      
      console.log('=== EXTRACTED BOOKING ID ===', bookingId);
      
      if (!bookingId) {
        console.error('No booking ID found in webhook payload');
        return res.status(httpStatus.BAD_REQUEST).json({
          error: 'No booking ID found in payload'
        });
      }

      // Get booking details
      console.log('=== FETCHING BOOKING ===', bookingId);
      const booking = await bookingService.getBookingById(bookingId);
      
      if (!booking) {
        console.error('Booking not found:', bookingId);
        return res.status(httpStatus.NOT_FOUND).json({
          error: 'Booking not found'
        });
      }
      
      console.log('=== FOUND BOOKING ===', {
        id: booking._id,
        status: booking.status,
        dateAndTime: booking.dateAndTime,
        service: booking.service?.name
      });

      // Only process if booking is still pending
      if (booking.status !== 'pending') {
        console.log('=== BOOKING ALREADY PROCESSED ===', booking.status);
        return res.status(httpStatus.OK).json({
          message: "Payment already processed for this booking",
        });
      }

      try {
        // Create Zoom meeting
        console.log('=== CREATING ZOOM MEETING ===');
        const zoomMeeting = await zoomService.createScheduledZoomMeeting(
          booking.dateAndTime,
          booking.service.duration
        );
        console.log('=== ZOOM MEETING CREATED ===', zoomMeeting);

        // Update booking status to confirmed
        console.log('=== UPDATING BOOKING STATUS ===');
        await bookingService.updateBookingById(bookingId, {
          meetingLink: zoomMeeting,
          status: "confirmed",
          paymentStatus: "paid",
          updatedAt: new Date()
        });
        
        console.log('=== BOOKING UPDATED SUCCESSFULLY ===');

        // Send confirmation email
        console.log('=== SENDING CONFIRMATION EMAIL ===');
        await emailService.sendConfirmationMail(
          booking.user.email,
          booking.user.name,
          zoomMeeting,
          moment(booking.dateAndTime).format("DD-MM-YYYY"),
          moment(booking.dateAndTime).format("HH:mm")
        );
        
        console.log('=== EMAIL SENT SUCCESSFULLY ===');
        console.log('=== PAYMENT PROCESSING COMPLETE ===', bookingId);
        
      } catch (updateError) {
        console.error('=== ERROR UPDATING BOOKING ===', updateError);
        throw updateError;
      }
    }
    
    return res.status(httpStatus.OK).json({
      message: "Webhook received and processed successfully",
      event: event
    });
  } catch (error) {
    console.error('=== WEBHOOK PROCESSING ERROR ===', error);
    console.error('Error stack:', error.stack);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Webhook processing failed',
      details: error.message
    });
  }
};

module.exports = {
  handleRazorpayWebhook,
};

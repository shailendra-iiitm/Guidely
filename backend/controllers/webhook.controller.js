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

    const { event } = req.body;
    console.log('Webhook received:', event);
    
    if (event === "order.paid") {
      const bookingId = req.body.payload.payment.entity.notes.bookingId;
      console.log('Processing payment for booking:', bookingId);

      const booking = await bookingService.getBookingById(bookingId);
      
      if (!booking) {
        console.error('Booking not found:', bookingId);
        return res.status(httpStatus.NOT_FOUND).json({
          error: 'Booking not found'
        });
      }

      // Create Zoom meeting
      const zoomMeeting = await zoomService.createScheduledZoomMeeting(
        booking.dateAndTime,
        booking.service.duration
      );

      // Update booking status
      await bookingService.updateBookingById(bookingId, {
        meetingLink: zoomMeeting,
        status: "confirmed",
      });

      // Send confirmation email
      await emailService.sendConfirmationMail(
        booking.user.email,
        booking.user.name,
        zoomMeeting,
        moment(booking.dateAndTime).format("DD-MM-YYYY"),
        moment(booking.dateAndTime).format("HH:mm")
      );
      
      console.log('Payment processed successfully for booking:', bookingId);
    }
    
    return res.status(httpStatus.OK).json({
      message: "Webhook received and processed successfully",
    });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Webhook processing failed'
    });
  }
};

module.exports = {
  handleRazorpayWebhook,
};

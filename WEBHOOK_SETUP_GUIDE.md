# 🔗 Webhook Testing Guide

## Test Your Webhook

### 1. Test Endpoint
Your webhook is available at:
```
https://guidely-backend.onrender.com/api/v1/webhook/razorpay
```

### 2. Test with curl (for development)
```bash
curl -X POST https://guidely-backend.onrender.com/api/v1/webhook/razorpay \
  -H "Content-Type: application/json" \
  -d '{
    "event": "order.paid",
    "payload": {
      "payment": {
        "entity": {
          "notes": {
            "bookingId": "test_booking_id"
          }
        }
      }
    }
  }'
```

### 3. Check Render Logs
After setting up the webhook in Razorpay:
1. Go to your Render dashboard
2. Navigate to your backend service
3. Check the "Logs" tab for webhook events

### 4. Webhook Events Handled
- ✅ `order.paid` - Payment successful
- ✅ `payment.captured` - Payment captured
- ✅ `payment.failed` - Payment failed
- ✅ `refund.created` - Refund processed

### 5. Security Features
- ✅ Webhook signature verification
- ✅ Error handling and logging
- ✅ Booking validation
- ✅ Automatic email notifications

## Next Steps
1. Create webhook in Razorpay dashboard
2. Add webhook secret to Render environment variables
3. Test with a real payment
4. Monitor logs for successful webhook processing

---
*Webhook endpoint is ready and secure!*

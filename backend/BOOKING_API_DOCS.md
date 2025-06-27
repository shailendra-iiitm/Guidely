# Booking System API Documentation

## Overview
Enhanced booking system with comprehensive functionality for both guides and learners.

## Guide Features

### 1. Confirm Booking
**Endpoint:** `PUT /api/v1/booking/confirm`
**Role:** Guide only
**Body:**
```json
{
  "bookingId": "booking_id_here",
  "meetingLink": "https://zoom.us/j/123456789" // optional
}
```

### 2. Reschedule Booking
**Endpoint:** `PUT /api/v1/booking/reschedule`
**Role:** Guide only
**Body:**
```json
{
  "bookingId": "booking_id_here",
  "newDateTime": "2025-07-05T10:00:00.000Z",
  "reason": "Personal emergency" // optional
}
```

### 3. Cancel Booking
**Endpoint:** `PUT /api/v1/booking/cancel`
**Role:** Guide or Learner
**Body:**
```json
{
  "bookingId": "booking_id_here",
  "reason": "Unable to attend" // optional
}
```

### 4. Update Meeting Link
**Endpoint:** `PUT /api/v1/booking/meeting-link`
**Role:** Guide only
**Body:**
```json
{
  "bookingId": "booking_id_here",
  "meetingLink": "https://zoom.us/j/123456789"
}
```

### 5. Start Session
**Endpoint:** `PUT /api/v1/booking/start`
**Role:** Guide or Learner
**Body:**
```json
{
  "bookingId": "booking_id_here"
}
```

### 6. Mark Session Complete
**Endpoint:** `PUT /api/v1/booking/complete`
**Role:** Guide only
**Body:**
```json
{
  "bookingId": "booking_id_here",
  "sessionNotes": "Student showed great progress in understanding concepts",
  "achievements": [
    {
      "title": "Problem Solving Master",
      "description": "Successfully solved complex algorithm problems"
    }
  ]
}
```

## Learner Features

### 1. Rate Session
**Endpoint:** `PUT /api/v1/booking/rate`
**Role:** Learner only
**Body:**
```json
{
  "bookingId": "booking_id_here",
  "rating": 5,
  "comment": "Excellent session, very helpful!"
}
```

### 2. Add Feedback
**Endpoint:** `PUT /api/v1/booking/feedback`
**Role:** Learner only
**Body:**
```json
{
  "bookingId": "booking_id_here",
  "feedback": "The session was very informative and the guide was patient.",
  "suggestions": "Maybe provide more real-world examples next time.",
  "highlights": "Loved the interactive coding session and personalized tips."
}
```

## Common Features

### 1. Get Bookings (Learner)
**Endpoint:** `GET /api/v1/booking/`
**Role:** Learner
**Response:**
```json
{
  "success": true,
  "bookings": [...],
  "categorized": {
    "upcoming": [...],
    "inProgress": [...],
    "completed": [...],
    "cancelled": [...],
    "pending": [...]
  },
  "stats": {
    "total": 5,
    "upcoming": 2,
    "inProgress": 0,
    "completed": 2,
    "cancelled": 1,
    "pending": 0
  }
}
```

### 2. Get Guide Bookings
**Endpoint:** `GET /api/v1/booking/guide`
**Role:** Guide only
**Response:** Same format as above

### 3. Get Booking Details
**Endpoint:** `GET /api/v1/booking/:bookingId`
**Role:** Guide or Learner (only their own bookings)
**Response:**
```json
{
  "success": true,
  "booking": {
    "_id": "booking_id",
    "status": "completed",
    "dateAndTime": "2025-06-28T10:00:00.000Z",
    "service": {...},
    "user": {...},
    "guide": {...},
    "meetingLink": "https://zoom.us/j/123456789",
    "sessionNotes": "Great session!",
    "rating": {
      "score": 5,
      "comment": "Excellent!",
      "ratedAt": "2025-06-28T11:00:00.000Z"
    },
    "feedback": {
      "generalFeedback": "Very helpful session",
      "suggestions": "More examples would be great",
      "highlights": "Interactive coding was amazing",
      "submittedAt": "2025-06-28T11:30:00.000Z"
    },
    "achievements": [...],
    "rescheduleHistory": [...],
    "sessionStartedAt": "2025-06-28T10:00:00.000Z",
    "sessionEndedAt": "2025-06-28T11:00:00.000Z"
  }
}
```

## Booking Status Flow

1. **pending** → Initial status for paid bookings
2. **confirmed** → Guide confirms or free session auto-confirmed
3. **upcoming** → Within 24 hours of scheduled time
4. **in-progress** → Session has started
5. **completed** → Session finished successfully
6. **cancelled** → Cancelled by guide/learner
7. **no-show** → Pending booking that passed the scheduled time

## Error Responses

All endpoints return consistent error format:
```json
{
  "success": false,
  "message": "Error description here"
}
```

Common HTTP status codes:
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (wrong role or not your booking)
- `404` - Not Found (booking doesn't exist)
- `500` - Internal Server Error

## Features Summary

### For Guides:
- ✅ View all bookings with categorization
- ✅ Confirm pending bookings
- ✅ Reschedule bookings with history tracking
- ✅ Cancel bookings with reason
- ✅ Update meeting links
- ✅ Start sessions
- ✅ Mark sessions complete with notes and achievements
- ✅ View detailed booking information

### For Learners:
- ✅ View all bookings with categorization
- ✅ Rate completed sessions (1-5 stars)
- ✅ Add detailed feedback and suggestions
- ✅ Cancel their own bookings
- ✅ Start sessions
- ✅ View detailed booking information

### System Features:
- ✅ Automatic status updates based on time
- ✅ Comprehensive booking history
- ✅ Reschedule tracking
- ✅ Achievement system
- ✅ Detailed feedback system
- ✅ Smart categorization
- ✅ Statistics and counts

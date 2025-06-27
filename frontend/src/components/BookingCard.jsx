import React, { useState } from 'react';
import { Card, Button, Tag, Modal, Input, Rate, message, Space, Divider, DatePicker } from 'antd';
import { 
  CalendarOutlined, 
  ClockCircleOutlined, 
  LinkOutlined, 
  StarOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  CloseCircleOutlined,
  ScheduleOutlined,
  MessageOutlined
} from '@ant-design/icons';
import bookingAPI from '../apiManger/booking';

const { TextArea } = Input;

const BookingCard = ({ booking, userRole, onBookingUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [showMeetingLinkModal, setShowMeetingLinkModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  
  const [meetingLink, setMeetingLink] = useState(booking.meetingLink || '');
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');
  const [achievements, setAchievements] = useState([]);
  const [rescheduleDate, setRescheduleDate] = useState(null);
  const [rescheduleReason, setRescheduleReason] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [feedback, setFeedback] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [highlights, setHighlights] = useState('');

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'blue';
      case 'upcoming': return 'cyan';
      case 'in-progress': return 'orange';
      case 'completed': return 'green';
      case 'cancelled': return 'red';
      case 'no-show': return 'volcano';
      default: return 'default';
    }
  };

  const isInProgress = () => {
    // First check if status is explicitly in-progress
    if (booking.status === 'in-progress') {
      return true;
    }
    
    // If status is completed, cancelled, or no-show, it's not in progress
    if (['completed', 'cancelled', 'no-show'].includes(booking.status)) {
      return false;
    }
    
    // Fallback logic for time-based check
    const sessionTime = new Date(booking.dateAndTime);
    const now = new Date();
    const sessionEnd = new Date(sessionTime.getTime() + (booking.service?.duration || 60) * 60000);
    return sessionTime <= now && sessionEnd > now &&
           ['confirmed', 'upcoming'].includes(booking.status);
  };

  const canStart = () => {
    const sessionTime = new Date(booking.dateAndTime);
    const now = new Date();
    const canStartTime = new Date(sessionTime.getTime() - 15 * 60000); // 15 minutes before
    return canStartTime <= now && 
           ['confirmed', 'upcoming'].includes(booking.status);
  };

  // Handler functions for new features
  const handleConfirmBooking = async () => {
    try {
      setLoading(true);
      await bookingAPI.confirmBooking(booking._id, meetingLink);
      message.success('Booking confirmed successfully!');
      setShowConfirmModal(false);
      onBookingUpdate && onBookingUpdate();
    } catch (error) {
      console.error('Failed to confirm booking:', error);
      message.error('Failed to confirm booking');
    } finally {
      setLoading(false);
    }
  };

  const handleRescheduleBooking = async () => {
    if (!rescheduleDate) {
      message.error('Please select a new date and time');
      return;
    }
    
    try {
      setLoading(true);
      await bookingAPI.rescheduleBooking(booking._id, rescheduleDate.toISOString(), rescheduleReason);
      message.success('Booking rescheduled successfully!');
      setShowRescheduleModal(false);
      setRescheduleDate(null);
      setRescheduleReason('');
      onBookingUpdate && onBookingUpdate();
    } catch (error) {
      console.error('Failed to reschedule booking:', error);
      message.error('Failed to reschedule booking');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    try {
      setLoading(true);
      await bookingAPI.cancelBooking(booking._id, cancelReason);
      message.success('Booking cancelled successfully!');
      setShowCancelModal(false);
      setCancelReason('');
      onBookingUpdate && onBookingUpdate();
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      message.error('Failed to cancel booking');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFeedback = async () => {
    if (!feedback && !suggestions && !highlights) {
      message.error('Please add at least one piece of feedback before submitting');
      return;
    }
    
    try {
      setLoading(true);
      await bookingAPI.addFeedback(booking._id, feedback, suggestions, highlights);
      message.success('Thank you for your detailed feedback!');
      setShowFeedbackModal(false);
      setFeedback('');
      setSuggestions('');
      setHighlights('');
      onBookingUpdate && onBookingUpdate();
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      message.error('Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleStartSession = async () => {
    try {
      setLoading(true);
      await bookingAPI.startSession(booking._id);
      message.success('Session started!');
      onBookingUpdate && onBookingUpdate();
    } catch (error) {
      console.error('Failed to start session:', error);
      message.error('Failed to start session');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMeetingLink = async () => {
    try {
      setLoading(true);
      await bookingAPI.updateMeetingLink(booking._id, meetingLink);
      message.success('Meeting link updated!');
      setShowMeetingLinkModal(false);
      onBookingUpdate && onBookingUpdate();
    } catch (error) {
      console.error('Failed to update meeting link:', error);
      message.error('Failed to update meeting link');
    } finally {
      setLoading(false);
    }
  };

  const handleRateSession = async () => {
    if (rating === 0) {
      message.error('Please provide a rating');
      return;
    }

    try {
      setLoading(true);
      await bookingAPI.rateSession(booking._id, rating, ratingComment);
      message.success('Thank you for rating!');
      setShowRatingModal(false);
      onBookingUpdate && onBookingUpdate();
    } catch (error) {
      console.error('Failed to submit rating:', error);
      message.error('Failed to submit rating');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteSession = async () => {
    try {
      setLoading(true);
      await bookingAPI.markSessionComplete(booking._id, sessionNotes, achievements);
      message.success('Session marked as completed!');
      setShowCompleteModal(false);
      onBookingUpdate && onBookingUpdate();
    } catch (error) {
      console.error('Failed to complete session:', error);
      message.error('Failed to complete session');
    } finally {
      setLoading(false);
    }
  };

  const renderGuideActions = () => {
    if (booking.status === 'completed') {
      return (
        <div className="text-sm text-gray-600">
          <CheckCircleOutlined className="text-green-500 mr-1" />
          Session completed
        </div>
      );
    }

    return (
      <Space direction="vertical" className="w-full" size="small">
        {/* Pending booking actions */}
        {booking.status === 'pending' && (
          <Space className="w-full">
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => setShowConfirmModal(true)}
              className="flex-1"
            >
              Confirm
            </Button>
            <Button
              icon={<CloseCircleOutlined />}
              onClick={() => setShowCancelModal(true)}
              danger
              className="flex-1"
            >
              Decline
            </Button>
          </Space>
        )}

        {/* Confirmed/Upcoming booking actions */}
        {(['confirmed', 'upcoming'].includes(booking.status)) && (
          <>
            <Button
              icon={<LinkOutlined />}
              onClick={() => setShowMeetingLinkModal(true)}
              className="w-full"
            >
              {booking.meetingLink ? 'Update Meeting Link' : 'Add Meeting Link'}
            </Button>
            
            <Space className="w-full">
              <Button
                icon={<ScheduleOutlined />}
                onClick={() => setShowRescheduleModal(true)}
                className="flex-1"
              >
                Reschedule
              </Button>
              <Button
                icon={<CloseCircleOutlined />}
                onClick={() => setShowCancelModal(true)}
                danger
                className="flex-1"
              >
                Cancel
              </Button>
            </Space>
          </>
        )}
        
        {canStart() && (
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={handleStartSession}
            loading={loading}
            className="w-full"
          >
            Start Session
          </Button>
        )}

        {isInProgress() && (
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={() => setShowCompleteModal(true)}
            className="w-full"
          >
            Mark Complete
          </Button>
        )}
      </Space>
    );
  };

  const renderLearnerActions = () => {
    if (booking.status === 'completed') {
      return (
        <Space direction="vertical" className="w-full" size="small">
          {!booking.rating && (
            <Button
              type="primary"
              icon={<StarOutlined />}
              onClick={() => setShowRatingModal(true)}
              className="w-full"
            >
              Rate Session
            </Button>
          )}
          
          {booking.rating && (
            <div className="space-y-2">
              <div className="text-sm text-gray-600 text-center">
                <StarOutlined className="text-yellow-500 mr-1" />
                Session rated ({booking.rating.score}/5)
                {booking.rating.comment && (
                  <div className="text-xs text-gray-500 mt-1">
                    "{booking.rating.comment}"
                  </div>
                )}
              </div>
              
              {!booking.feedback && (
                <Button
                  size="small"
                  icon={<MessageOutlined />}
                  onClick={() => setShowFeedbackModal(true)}
                  className="w-full"
                  type="link"
                >
                  Add Detailed Feedback (Optional)
                </Button>
              )}
              
              {booking.feedback && (
                <div className="text-xs text-gray-500 text-center">
                  ✓ Detailed feedback provided
                </div>
              )}
            </div>
          )}
        </Space>
      );
    }

    return (
      <Space direction="vertical" className="w-full" size="small">
        {canStart() && (
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={handleStartSession}
            loading={loading}
            className="w-full"
          >
            Join Session
          </Button>
        )}
        
        {booking.meetingLink && ['confirmed', 'upcoming', 'in-progress'].includes(booking.status) && (
          <Button
            type="link"
            href={booking.meetingLink}
            target="_blank"
            icon={<LinkOutlined />}
            className="w-full"
          >
            Open Meeting Link
          </Button>
        )}
        
        {['pending', 'confirmed', 'upcoming'].includes(booking.status) && (
          <Button
            icon={<CloseCircleOutlined />}
            onClick={() => setShowCancelModal(true)}
            danger
            className="w-full"
          >
            Cancel Booking
          </Button>
        )}
      </Space>
    );
  };

  return (
    <>
      <Card className="booking-card shadow-md">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold">{booking.service?.name}</h3>
            <p className="text-gray-600">
              with {userRole === 'guide' ? booking.user?.name : booking.guide?.name}
            </p>
          </div>
          <Tag color={getStatusColor(booking.status)} className="capitalize">
            {booking.status.replace('-', ' ')}
          </Tag>
        </div>

        <Space direction="vertical" className="w-full mb-4">
          <div className="flex items-center text-gray-600">
            <CalendarOutlined className="mr-2" />
            {new Date(booking.dateAndTime).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          <div className="flex items-center text-gray-600">
            <ClockCircleOutlined className="mr-2" />
            {new Date(booking.dateAndTime).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })}
          </div>
          {booking.meetingLink && (
            <div className="flex items-center text-blue-600">
              <LinkOutlined className="mr-2" />
              Meeting link available
            </div>
          )}
        </Space>

        <Divider />

        {userRole === 'guide' ? renderGuideActions() : renderLearnerActions()}
      </Card>

      {/* Confirm Booking Modal */}
      <Modal
        title="Confirm Booking"
        open={showConfirmModal}
        onOk={handleConfirmBooking}
        onCancel={() => setShowConfirmModal(false)}
        confirmLoading={loading}
      >
        <div className="space-y-4">
          <p>Are you sure you want to confirm this booking?</p>
          <div>
            <label className="block text-sm font-medium mb-2">Meeting Link (optional):</label>
            <Input
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              placeholder="https://zoom.us/j/123456789"
            />
          </div>
        </div>
      </Modal>

      {/* Reschedule Modal */}
      <Modal
        title="Reschedule Booking"
        open={showRescheduleModal}
        onOk={handleRescheduleBooking}
        onCancel={() => setShowRescheduleModal(false)}
        confirmLoading={loading}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">New Date & Time:</label>
            <DatePicker
              showTime
              value={rescheduleDate}
              onChange={setRescheduleDate}
              className="w-full"
              disabledDate={(current) => current && current < new Date()}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Reason (optional):</label>
            <TextArea
              value={rescheduleReason}
              onChange={(e) => setRescheduleReason(e.target.value)}
              rows={2}
              placeholder="Reason for rescheduling..."
            />
          </div>
        </div>
      </Modal>

      {/* Cancel Modal */}
      <Modal
        title="Cancel Booking"
        open={showCancelModal}
        onOk={handleCancelBooking}
        onCancel={() => setShowCancelModal(false)}
        confirmLoading={loading}
      >
        <div className="space-y-4">
          <p>Are you sure you want to cancel this booking?</p>
          <div>
            <label className="block text-sm font-medium mb-2">Reason (optional):</label>
            <TextArea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={2}
              placeholder="Reason for cancellation..."
            />
          </div>
        </div>
      </Modal>

      {/* Feedback Modal */}
      <Modal
        title="Add Detailed Feedback (Optional)"
        open={showFeedbackModal}
        onOk={handleAddFeedback}
        onCancel={() => setShowFeedbackModal(false)}
        confirmLoading={loading}
        width={600}
      >
        <div className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            Your session has already been rated! This additional feedback is completely optional 
            but helps improve the learning experience for future sessions.
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">General Feedback (Optional):</label>
            <TextArea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
              placeholder="How was your overall experience?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Suggestions for Improvement (Optional):</label>
            <TextArea
              value={suggestions}
              onChange={(e) => setSuggestions(e.target.value)}
              rows={3}
              placeholder="What could be improved in future sessions?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Session Highlights (Optional):</label>
            <TextArea
              value={highlights}
              onChange={(e) => setHighlights(e.target.value)}
              rows={3}
              placeholder="What did you find most valuable or interesting?"
            />
          </div>
        </div>
      </Modal>

      {/* Meeting Link Modal */}
      <Modal
        title={booking.meetingLink ? "Update Meeting Link" : "Add Meeting Link"}
        open={showMeetingLinkModal}
        onOk={handleUpdateMeetingLink}
        onCancel={() => setShowMeetingLinkModal(false)}
        confirmLoading={loading}
      >
        <div>
          <label className="block text-sm font-medium mb-2">Meeting Link:</label>
          <Input
            value={meetingLink}
            onChange={(e) => setMeetingLink(e.target.value)}
            placeholder="https://zoom.us/j/123456789"
          />
        </div>
      </Modal>

      {/* Rating Modal */}
      <Modal
        title="Rate Your Session"
        open={showRatingModal}
        onOk={handleRateSession}
        onCancel={() => setShowRatingModal(false)}
        confirmLoading={loading}
        okText="Submit Rating"
      >
        <div className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            Please rate your session experience. Your rating helps other learners and helps us improve our platform.
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Rating: *</label>
            <Rate value={rating} onChange={setRating} />
            {rating === 0 && (
              <div className="text-xs text-red-500 mt-1">Please select a rating</div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Quick Comment (Optional):</label>
            <TextArea
              value={ratingComment}
              onChange={(e) => setRatingComment(e.target.value)}
              rows={2}
              placeholder="Share a brief comment about your experience..."
              maxLength={200}
            />
            <div className="text-xs text-gray-500 mt-1">
              You can add detailed feedback later if you wish.
            </div>
          </div>
        </div>
      </Modal>

      {/* Complete Session Modal */}
      <Modal
        title="Complete Session"
        open={showCompleteModal}
        onOk={handleCompleteSession}
        onCancel={() => setShowCompleteModal(false)}
        confirmLoading={loading}
        width={600}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Session Notes:</label>
            <TextArea
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              rows={3}
              placeholder="Add notes about the session..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Add Achievement for Learner:</label>
            <Button
              onClick={() => {
                setAchievements([{
                  title: `Completed ${booking.service?.name}`,
                  description: `Successfully completed a session on ${new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}`
                }]);
              }}
              disabled={achievements.length > 0}
            >
              Add Session Completion Achievement
            </Button>
            {achievements.length > 0 && (
              <div className="mt-2 p-2 bg-green-50 rounded">
                <TrophyOutlined className="text-yellow-500 mr-1" />
                Achievement will be added to learner's profile
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default BookingCard;

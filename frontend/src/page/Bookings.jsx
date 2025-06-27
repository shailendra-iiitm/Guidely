// Note: If moment is not installed, we're using native Date methods to avoid additional dependencies

import React, { useState, useEffect } from 'react';
import { Tabs, Spin, message, Empty } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import bookingAPI from '../apiManger/booking';
import BookingCard from '../components/BookingCard';
import useUserStore from '../store/user';

const { TabPane } = Tabs;

const Bookings = () => {
  const { user } = useUserStore();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      console.log('Fetching bookings for user:', user?.role, user?._id);
      
      let response;
      
      if (user?.role === 'guide') {
        console.log('Fetching guide bookings...');
        response = await bookingAPI.getGuideBookings();
      } else {
        console.log('Fetching learner bookings...');
        response = await bookingAPI.getLearnerBookings();
      }

      console.log('Booking API response:', response);
      console.log('Response data:', response?.data);

      if (response?.data?.success) {
        console.log('Setting bookings:', response.data.bookings);
        setBookings(response.data.bookings);
      } else {
        console.log('API response was not successful');
        message.error('Failed to load bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      console.error('Error response:', error.response);
      message.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const categorizeBookings = () => {
    const now = new Date();
    
    const upcoming = bookings.filter(booking => {
      const sessionTime = new Date(booking.dateAndTime);
      return sessionTime > now && ['confirmed', 'upcoming'].includes(booking.status);
    });

    const inProgress = bookings.filter(booking => {
      const sessionTime = new Date(booking.dateAndTime);
      const sessionEnd = new Date(sessionTime.getTime() + (booking.service?.duration || 60) * 60000);
      return (sessionTime <= now && sessionEnd > now) || 
             booking.status === 'in-progress';
    });

    const completed = bookings.filter(booking => {
      return booking.status === 'completed';
    });

    const cancelled = bookings.filter(booking => {
      return ['cancelled', 'no-show'].includes(booking.status);
    });

    return { upcoming, inProgress, completed, cancelled };
  };

  const { upcoming, inProgress, completed, cancelled } = categorizeBookings();

  const renderBookingList = (bookingList, emptyMessage) => {
    if (bookingList.length === 0) {
      return (
        <div className="text-center py-8">
          <Empty description={emptyMessage} />
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {bookingList.map(booking => (
          <BookingCard
            key={booking._id}
            booking={booking}
            userRole={user?.role}
            onBookingUpdate={fetchBookings}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        {user?.role === 'guide' ? 'My Sessions' : 'My Bookings'}
      </h1>

      {/* Debug info - remove in production */}
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <h3 className="font-bold">Debug Info:</h3>
        <p>User Role: {user?.role}</p>
        <p>User ID: {user?._id}</p>
        <p>Total Bookings: {bookings.length}</p>
        <p>Upcoming: {upcoming.length}</p>
        <p>In Progress: {inProgress.length}</p>
        <p>Completed: {completed.length}</p>
        <p>Cancelled: {cancelled.length}</p>
        
        {bookings.length > 0 && (
          <details className="mt-2">
            <summary className="cursor-pointer font-medium">View Raw Booking Data</summary>
            <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto max-h-40">
              {JSON.stringify(bookings.map(b => ({
                id: b._id,
                status: b.status,
                dateTime: b.dateAndTime,
                service: b.service?.name,
                guide: b.guide?.name,
                user: b.user?.name,
                price: b.price
              })), null, 2)}
            </pre>
          </details>
        )}
      </div>

      <Tabs defaultActiveKey="upcoming" size="large">
        <TabPane
          tab={
            <span>
              <CalendarOutlined />
              Upcoming ({upcoming.length})
            </span>
          }
          key="upcoming"
        >
          {renderBookingList(upcoming, "No upcoming sessions")}
        </TabPane>

        <TabPane
          tab={
            <span>
              <ClockCircleOutlined />
              In Progress ({inProgress.length})
            </span>
          }
          key="inprogress"
        >
          {renderBookingList(inProgress, "No sessions in progress")}
        </TabPane>

        <TabPane
          tab={
            <span>
              <CheckCircleOutlined />
              Completed ({completed.length})
            </span>
          }
          key="completed"
        >
          {renderBookingList(completed, "No completed sessions")}
        </TabPane>

        {cancelled.length > 0 && (
          <TabPane
            tab={
              <span>
                Cancelled ({cancelled.length})
              </span>
            }
            key="cancelled"
          >
            {renderBookingList(cancelled, "No cancelled sessions")}
          </TabPane>
        )}
      </Tabs>
    </div>
  );
};

export default Bookings;

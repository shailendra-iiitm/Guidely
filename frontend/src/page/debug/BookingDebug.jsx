import React, { useState } from 'react';
import { Button, Card, message } from 'antd';
import bookingAPI from '../../apiManger/booking';
import useUserStore from '../../store/user';

const BookingDebug = () => {
  const [loading, setLoading] = useState(false);
  const [learnerBookings, setLearnerBookings] = useState([]);
  const [guideBookings, setGuideBookings] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useUserStore();

  const testLearnerBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Testing learner bookings API...');
      const response = await bookingAPI.getLearnerBookings();
      console.log('Learner bookings response:', response);
      setLearnerBookings(response?.data?.bookings || []);
      message.success(`Fetched ${response?.data?.bookings?.length || 0} learner bookings`);
    } catch (err) {
      console.error('Error fetching learner bookings:', err);
      setError(err.response?.data || err.message);
      message.error('Failed to fetch learner bookings');
    }
    setLoading(false);
  };

  const testGuideBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Testing guide bookings API...');
      const response = await bookingAPI.getGuideBookings();
      console.log('Guide bookings response:', response);
      setGuideBookings(response?.data?.bookings || []);
      message.success(`Fetched ${response?.data?.bookings?.length || 0} guide bookings`);
    } catch (err) {
      console.error('Error fetching guide bookings:', err);
      setError(err.response?.data || err.message);
      message.error('Failed to fetch guide bookings');
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Booking API Debug</h1>
      
      <Card className="mb-4">
        <h3 className="text-lg font-semibold mb-2">User Info</h3>
        <pre className="bg-gray-100 p-2 rounded text-sm">
          {JSON.stringify({
            id: user?._id,
            name: user?.name,
            role: user?.role,
            email: user?.email
          }, null, 2)}
        </pre>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Button 
          type="primary" 
          onClick={testLearnerBookings}
          loading={loading}
          block
        >
          Test Learner Bookings API
        </Button>
        
        <Button 
          type="primary" 
          onClick={testGuideBookings}
          loading={loading}
          block
        >
          Test Guide Bookings API
        </Button>
      </div>

      {error && (
        <Card className="mb-4 border-red-500">
          <h3 className="text-lg font-semibold mb-2 text-red-600">Error</h3>
          <pre className="bg-red-50 p-2 rounded text-sm text-red-700">
            {JSON.stringify(error, null, 2)}
          </pre>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-lg font-semibold mb-2">Learner Bookings ({learnerBookings.length})</h3>
          <pre className="bg-gray-100 p-2 rounded text-sm max-h-60 overflow-auto">
            {JSON.stringify(learnerBookings.map(b => ({
              id: b._id,
              status: b.status,
              service: b.service?.name,
              guide: b.guide?.name,
              dateTime: b.dateAndTime,
              price: b.price
            })), null, 2)}
          </pre>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-2">Guide Bookings ({guideBookings.length})</h3>
          <pre className="bg-gray-100 p-2 rounded text-sm max-h-60 overflow-auto">
            {JSON.stringify(guideBookings.map(b => ({
              id: b._id,
              status: b.status,
              service: b.service?.name,
              user: b.user?.name,
              dateTime: b.dateAndTime,
              price: b.price
            })), null, 2)}
          </pre>
        </Card>
      </div>
    </div>
  );
};

export default BookingDebug;

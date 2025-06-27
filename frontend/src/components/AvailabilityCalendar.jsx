import React, { useState, useEffect } from "react";
import { Calendar, Badge, Spin, message } from "antd";
import moment from "moment";
import availability from "../apiManger/availability";
import booking from "../apiManger/booking";
import useUserStore from "../store/user";

const AvailabilityCalendar = () => {
  const { user } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [availabilityData, setAvailabilityData] = useState([]);
  const [bookingsData, setBookingsData] = useState([]);

  useEffect(() => {
    const loadGuideData = async () => {
      try {
        setLoading(true);
        
        // Load availability for next 14 days
        const availResponse = await availability.getGuideAvailability(user._id, 30);
        setAvailabilityData(availResponse?.data?.availability || []);
        
        // Load bookings
        const bookingsResponse = await booking.getGuideBookings();
        setBookingsData(bookingsResponse?.data?.bookings || []);
        
      } catch (error) {
        console.error('Error loading guide data:', error);
        message.error('Failed to load calendar data');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'guide') {
      loadGuideData();
    }
  }, [user]);

  const getDateData = (date) => {
    const dateStr = moment(date).format('YYYY-MM-DD');
    
    // Find availability for this date
    const dayAvailability = availabilityData.find(day => 
      moment(day.date).format('YYYY-MM-DD') === dateStr
    );
    
    // Find bookings for this date
    const dayBookings = bookingsData.filter(booking => 
      moment(booking.dateAndTime).format('YYYY-MM-DD') === dateStr
    );
    
    const availableSlots = dayAvailability?.slots?.length || 0;
    const bookedSlots = dayBookings.length;
    
    return {
      available: availableSlots - bookedSlots,
      booked: bookedSlots,
      total: availableSlots
    };
  };

  const dateCellRender = (value) => {
    const { available, booked, total } = getDateData(value);
    
    if (total === 0) {
      return null;
    }

    return (
      <div className="calendar-cell">
        {available > 0 && (
          <Badge 
            status="success" 
            text={`${available} available`}
            className="block text-xs"
          />
        )}
        {booked > 0 && (
          <Badge 
            status="processing" 
            text={`${booked} booked`}
            className="block text-xs"
          />
        )}
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
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-4">Availability Calendar</h3>
      <p className="text-gray-600 mb-4">
        This calendar shows your availability based on your weekly schedule and current bookings.
      </p>
      
      <Calendar
        dateCellRender={dateCellRender}
        className="availability-calendar"
      />
      
      <div className="mt-4 text-sm text-gray-600">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Badge status="success" />
            <span>Available slots</span>
          </div>
          <div className="flex items-center gap-1">
            <Badge status="processing" />
            <span>Booked slots</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;

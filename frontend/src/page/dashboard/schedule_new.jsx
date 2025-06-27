import React, { useState, useEffect } from "react";
import { Card, Button, message, Spin, TimePicker, Popconfirm, Tabs } from "antd";
import { PlusOutlined, DeleteOutlined, CalendarOutlined, SettingOutlined } from "@ant-design/icons";
import moment from "moment";
import availability from "../../apiManger/availability";
import AvailabilityCalendar from "../../components/AvailabilityCalendar";

const { TabPane } = Tabs;

const Schedule = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [weeklySchedule, setWeeklySchedule] = useState({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
  });
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [hasExistingSchedule, setHasExistingSchedule] = useState(false);

  const daysOfWeek = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  // Load existing availability from backend
  useEffect(() => {
    loadAvailability();
  }, []);

  const loadAvailability = async () => {
    try {
      setLoading(true);
      const response = await availability.getMyAvailability();
      
      if (response?.data?.availability) {
        const { weeklyAvailability, unavailableDates: unavailable } = response.data.availability;
        setWeeklySchedule(weeklyAvailability || {
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
          saturday: [],
          sunday: []
        });
        setUnavailableDates(unavailable || []);
        setHasExistingSchedule(true);
        message.success('Schedule loaded successfully');
      } else {
        // No existing schedule
        setHasExistingSchedule(false);
      }
    } catch (error) {
      console.error('Error loading availability:', error);
      if (error.response?.status === 404) {
        // No existing schedule found
        setHasExistingSchedule(false);
      } else {
        message.error('Failed to load existing schedule');
      }
    } finally {
      setLoading(false);
    }
  };

  const addTimeSlot = (day) => {
    const newSlot = {
      startTime: "09:00",
      endTime: "10:00"
    };
    
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: [...prev[day], newSlot]
    }));
  };

  const removeTimeSlot = (day, index) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index)
    }));
  };

  const updateTimeSlot = (day, index, field, value) => {
    const timeString = value ? value.format('HH:mm') : '';
    
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: prev[day].map((slot, i) => 
        i === index ? { ...slot, [field]: timeString } : slot
      )
    }));
  };

  const saveSchedule = async () => {
    try {
      setSaving(true);
      
      // Validate schedule
      const hasInvalidSlots = Object.keys(weeklySchedule).some(day => 
        weeklySchedule[day].some(slot => 
          !slot.startTime || !slot.endTime || 
          moment(slot.endTime, 'HH:mm').isSameOrBefore(moment(slot.startTime, 'HH:mm'))
        )
      );

      if (hasInvalidSlots) {
        message.error('Please ensure all time slots have valid start and end times');
        return;
      }

      const scheduleData = {
        weeklyAvailability: weeklySchedule,
        unavailableDates: unavailableDates
      };

      if (hasExistingSchedule) {
        await availability.updateAvailability(scheduleData);
        message.success('Schedule updated successfully!');
      } else {
        await availability.createAvailability(scheduleData);
        message.success('Schedule created successfully!');
        setHasExistingSchedule(true);
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save schedule';
      message.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Schedule Management</h2>
        <p className="text-gray-600">
          Set your weekly availability and view your calendar with bookings.
        </p>
      </div>

      <Tabs defaultActiveKey="setup" size="large">
        <TabPane tab={<><SettingOutlined /> Setup Weekly Schedule</>} key="setup">
          <div className="space-y-4">
            {daysOfWeek.map(({ key, label }) => (
              <Card key={key} className="w-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{label}</h3>
                  <Button 
                    type="dashed" 
                    icon={<PlusOutlined />}
                    onClick={() => addTimeSlot(key)}
                  >
                    Add Time Slot
                  </Button>
                </div>
                
                {weeklySchedule[key]?.length === 0 ? (
                  <p className="text-gray-500 italic">No availability set for this day</p>
                ) : (
                  <div className="space-y-3">
                    {weeklySchedule[key]?.map((slot, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">From:</span>
                          <TimePicker
                            value={slot.startTime ? moment(slot.startTime, 'HH:mm') : null}
                            format="HH:mm"
                            onChange={(value) => updateTimeSlot(key, index, 'startTime', value)}
                            placeholder="Start time"
                          />
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">To:</span>
                          <TimePicker
                            value={slot.endTime ? moment(slot.endTime, 'HH:mm') : null}
                            format="HH:mm"
                            onChange={(value) => updateTimeSlot(key, index, 'endTime', value)}
                            placeholder="End time"
                          />
                        </div>
                        
                        <Popconfirm
                          title="Remove this time slot?"
                          onConfirm={() => removeTimeSlot(key, index)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button 
                            type="text" 
                            danger 
                            icon={<DeleteOutlined />}
                            className="ml-auto"
                          />
                        </Popconfirm>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Button 
              type="primary" 
              size="large"
              loading={saving}
              onClick={saveSchedule}
              className="px-8"
            >
              {hasExistingSchedule ? 'Update Schedule' : 'Create Schedule'}
            </Button>
          </div>

          {/* Schedule Preview */}
          <Card className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Schedule Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {daysOfWeek.map(({ key, label }) => (
                <div key={key} className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">{label}</h4>
                  {weeklySchedule[key]?.length === 0 ? (
                    <p className="text-gray-500 text-sm">Not available</p>
                  ) : (
                    <div className="space-y-1">
                      {weeklySchedule[key]?.map((slot, index) => (
                        <div key={index} className="text-sm text-green-600">
                          {slot.startTime} - {slot.endTime}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </TabPane>

        <TabPane tab={<><CalendarOutlined /> Calendar View</>} key="calendar">
          <AvailabilityCalendar />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Schedule;

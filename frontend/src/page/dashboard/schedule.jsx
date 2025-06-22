import React, { useState, useEffect } from "react";
import { Calendar, Modal, Button, Checkbox } from "antd";
import moment from "moment";
import Dashboard from "./dashboard";

const Schedule = () => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Initialize available slots (9 AM to 3 PM for all days)
    const slots = [];
    for (let hour = 9; hour <= 15; hour++) {
      const start = moment().set({ hour, minute: 0 });
      const end = moment().set({ hour, minute: 59 });
      slots.push(`${start.format("hh:mm A")} - ${end.format("hh:mm A")}`);
    }
    setAvailableSlots(slots);
  }, []);

  const handleSelectDate = (date) => {
    const selectedDate = moment(date).format("YYYY-MM-DD");
    if (moment(selectedDate).isBefore(moment().format("YYYY-MM-DD"))) return;
    if (selectedDates.includes(selectedDate)) {
      setSelectedDates(selectedDates.filter((d) => d !== selectedDate));
    } else {
      setSelectedDates([...selectedDates, selectedDate]);
    }
    setShowModal(true);
  };

  const handleMarkUnavailable = () => {
    setUnavailableDates((prev) => [...new Set([...prev, ...selectedDates])]);
    setShowModal(false);
    setSelectedDates([]);
  };

  const handleSlotSelection = (value) => setSelectedSlots(value);

  const handleScheduleSave = () => {
    const newBookings = selectedDates.flatMap((date) =>
      selectedSlots.map((slot) => ({ date, slot }))
    );
    const uniqueBookings = newBookings.filter(
      (newBooking) =>
        !bookedSlots.some(
          (existing) =>
            existing.date === newBooking.date && existing.slot === newBooking.slot
        )
    );
    setBookedSlots((prev) => [...prev, ...uniqueBookings]);
    setShowModal(false);
    setSelectedSlots([]);
    setSelectedDates([]);
  };

  const dateCellRender = (value) => {
    const currentDate = moment(value).format("YYYY-MM-DD");
    if (unavailableDates.includes(currentDate)) {
      return <div className="bg-red-500 text-white p-2 rounded">Unavailable</div>;
    }
    const bookedOnDay = bookedSlots.filter((slot) => slot.date === currentDate);
    if (bookedOnDay.length) {
      return (
        <div>
          {bookedOnDay.map((slot, idx) => (
            <div key={idx} className="bg-green-200 p-1 rounded text-xs">
              {slot.slot}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Dashboard>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Guide Schedule Management</h2>
        <Calendar
          fullscreen={false}
          dateCellRender={dateCellRender}
          onSelect={handleSelectDate}
        />
        <Modal
          title="Select Available Time Slots"
          open={showModal}
          onCancel={() => setShowModal(false)}
          footer={[
            <Button key="cancel" onClick={() => setShowModal(false)}>Cancel</Button>,
            <Button key="save" type="primary" onClick={handleScheduleSave}>Save Slots</Button>,
            <Button key="unavailable" danger onClick={handleMarkUnavailable}>Mark Unavailable</Button>,
          ]}
        >
          <Checkbox.Group
            options={availableSlots}
            onChange={handleSlotSelection}
            value={selectedSlots}
          />
        </Modal>
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Next 7 Days Overview</h3>
          <ul>
            {Array.from({ length: 7 }, (_, idx) => {
              const date = moment().add(idx, "days").format("YYYY-MM-DD");
              const booked = bookedSlots.filter((slot) => slot.date === date);
              return (
                <li key={date} className="flex justify-between p-2">
                  <span>{date}</span>
                  <span>
                    {booked.length > 0 ? `${booked.length} booked slots` : "No bookings"}
                  </span>
                </li>
              );
            })}
          </ul>
          <h3 className="mt-4 text-xl font-semibold">Unavailable Dates</h3>
          <ul>
            {unavailableDates.length > 0
              ? unavailableDates.map((date) => (
                  <li key={date} className="p-2">{date}</li>
                ))
              : <li className="p-2">No unavailable dates marked</li>
            }
          </ul>
        </div>
      </div>
    </Dashboard>
  );
};

export default Schedule;

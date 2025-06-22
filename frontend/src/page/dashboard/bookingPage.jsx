import { useEffect, useState } from "react";
import { Table, Button, Spin } from "antd";
import moment from "moment";
import Layout from "../../components/Layout";
import bookingAPI from "../../apiManger/booking";

const Booking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming"); // 'upcoming' or 'past'

  const fetchBookings = async () => {
    setLoading(true);
    try {
      // Fetch all bookings made by the logged-in user
      const res = await bookingAPI.getLearnerBookings();
      setBookings(res?.data?.bookings || []);
    } catch {
      setBookings([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handlePayNow = (bookingId) => {
    console.log('Processing payment for booking:', bookingId);
    // Will add booking logic heree
  };

  // Filter bookings based on tab
  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === "upcoming") {
      return moment(booking.dateAndTime).isAfter(moment());
    } else {
      return moment(booking.dateAndTime).isBefore(moment());
    }
  });

  const columns = [
    {
      title: "Date & Time",
      dataIndex: "dateAndTime",
      key: "dateAndTime",
      render: (text) => moment(text).format("DD MMM YYYY, hh:mm A"),
    },
    {
      title: "Guide",
      dataIndex: "guideName",
      key: "guideName",
      render: (_, record) => record.guideName || "N/A",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          className={
            status === "pending"
              ? "text-yellow-600 font-semibold"
              : status === "confirmed"
              ? "text-green-700 font-semibold"
              : "text-gray-700"
          }
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `₹${price}`,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) =>
        record.status === "pending" ? (
          <Button type="primary" onClick={() => handlePayNow(record._id)}>
            Pay Now
          </Button>
        ) : null,
    },
  ];

  return (
    <Layout>
      <div className="container p-4 mx-auto">
        <h2 className="text-2xl font-bold mb-4">Your Bookings with Guides</h2>
        <div className="flex mb-6 space-x-4">
          <Button
            type={activeTab === "upcoming" ? "primary" : "default"}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming Bookings
          </Button>
          <Button
            type={activeTab === "past" ? "primary" : "default"}
            onClick={() => setActiveTab("past")}
          >
            Past Bookings
          </Button>
        </div>

        {loading ? (
          <Spin size="large" />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredBookings}
            pagination={{ pageSize: 5 }}
            rowKey={(record) => record._id}
          />
        )}
      </div>
    </Layout>
  );
};

export default Booking;

import { useEffect, useState } from "react";
import { Table, Button, Spin } from "antd";
import moment from "moment";
import bookingAPI from "../../apiManger/booking";
import Dashboard from "./dashboard";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming"); 

  const fetchBookings = async () => {
    setLoading(true);
    try {
      // For Guidely, this should fetch all bookings for the logged-in guide
      const res = await bookingAPI.getGuideBookings();
      setBookings(res?.data?.bookings || []);
    } catch {
      setBookings([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Filter bookings based on tab selection
  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === "upcoming") {
      return moment(booking.dateAndTime).isAfter(moment());
    } else {
      return moment(booking.dateAndTime).isBefore(moment());
    }
  });

  const columns = [
    {
      title: "Date",
      dataIndex: "dateAndTime",
      key: "date",
      render: (text) => moment(text).format("DD MMM YYYY"),
    },
    {
      title: "Time",
      dataIndex: "dateAndTime",
      key: "time",
      render: (text) => moment(text).format("hh:mm A"),
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
  ];

  const rowClassName = (record) => {
    if (record.status === "pending") {
      return "bg-yellow-100";
    } else if (record.status === "confirmed") {
      return "bg-green-50";
    }
    return "";
  };

  return (
    <Dashboard>
      <div className="container p-4 mx-auto">
        <h2 className="text-2xl font-bold mb-4">Your Guide Bookings</h2>
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
            rowClassName={rowClassName}
          />
        )}
      </div>
    </Dashboard>
  );
};

export default Bookings;

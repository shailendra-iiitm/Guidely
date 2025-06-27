import { useEffect, useState } from "react";
import { Table, Button, Spin } from "antd";
import moment from "moment";
import bookingAPI from "../../apiManger/booking";
import useUserStore from "../../store/user";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const { user } = useUserStore();
  const isLearner = user?.role === "learner" || user?.role === "student";

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        console.log("Fetching bookings for user role:", user?.role);
        console.log("User ID:", user?._id);
        console.log("Is learner:", isLearner);
        
        // Fetch bookings based on user role
        const res = isLearner 
          ? await bookingAPI.getLearnerBookings()
          : await bookingAPI.getGuideBookings();
        
        console.log("Booking API response:", res);
        console.log("Response status:", res?.status);
        console.log("Response data:", res?.data);
        console.log("Bookings array:", res?.data?.bookings);
        
        const bookingsData = res?.data?.bookings || [];
        console.log("Setting bookings:", bookingsData);
        setBookings(bookingsData);
        
      } catch (error) {
        console.error("Error fetching bookings:", error);
        console.error("Error response:", error.response);
        console.error("Error message:", error.message);
        
        // Try to get more details about the error
        if (error.response) {
          console.error("HTTP Status:", error.response.status);
          console.error("Response data:", error.response.data);
        }
        
        setBookings([]);
      }
      setLoading(false);
    };

    if (user?._id) {
      fetchBookings();
    } else {
      console.log("No user ID available, skipping booking fetch");
      setLoading(false);
    }
  }, [isLearner, user?.role, user?._id]);

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
      title: isLearner ? "Guide" : "Learner",
      key: isLearner ? "guide" : "learner",
      render: (_, record) => {
        if (isLearner) {
          return record.guide?.name || "N/A";
        } else {
          return record.user?.name || "N/A";
        }
      },
    },
    {
      title: "Service",
      key: "service",
      render: (_, record) => record.service?.name || "N/A",
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
      <div className="container p-4 mx-auto">
        <h2 className="text-2xl font-bold mb-4">
          {isLearner ? "My Learning Sessions" : "Your Guide Bookings"}
        </h2>
        
        {/* Debug info - remove in production */}
        <div className="mb-4 p-2 bg-gray-100 rounded text-sm">
          <p>User Role: {user?.role}</p>
          <p>Is Learner: {isLearner ? 'Yes' : 'No'}</p>
          <p>Total Bookings: {bookings.length}</p>
          <p>Filtered Bookings: {filteredBookings.length}</p>
        </div>
        
        <div className="flex mb-6 space-x-4">
          <Button
            type={activeTab === "upcoming" ? "primary" : "default"}
            onClick={() => setActiveTab("upcoming")}
          >
            {isLearner ? "Upcoming Sessions" : "Upcoming Bookings"}
          </Button>
          <Button
            type={activeTab === "past" ? "primary" : "default"}
            onClick={() => setActiveTab("past")}
          >
            {isLearner ? "Past Sessions" : "Past Bookings"}
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
  );
};

export default Bookings;

import React, { useEffect, useState } from "react";
import { Table, Spin, Alert, message } from "antd";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import useUserStore from "../../store/user";
import paymentAPI from "../../apiManger/payment";

const Payment = () => {
  const { user } = useUserStore();
  const isLearner = user?.role === "learner" || user?.role === "student";
  
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [paymentStats, setPaymentStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const fetchPaymentData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch payment history and stats in parallel
      const [historyResponse, statsResponse] = await Promise.all([
        paymentAPI.getPaymentHistory(),
        paymentAPI.getPaymentStats()
      ]);
      
      setPaymentHistory(historyResponse.data.data || []);
      setPaymentStats(statsResponse.data.data || {});
    } catch (error) {
      console.error("Error fetching payment data:", error);
      setError("Failed to load payment data. Please try again.");
      message.error("Failed to load payment data");
    } finally {
      setLoading(false);
    }
  };

  const guideColumns = [
    {
      title: "No.",
      key: "no",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Learner Name",
      dataIndex: "learnerName",
      key: "learnerName",
      render: (_, record) => record.booking?.learner?.name || "Unknown Learner",
    },
    {
      title: "Service",
      dataIndex: "serviceName",
      key: "serviceName",
      render: (_, record) => record.booking?.service?.title || "Unknown Service",
    },
    {
      title: "Transaction ID",
      dataIndex: "transactionId",
      key: "transactionId",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `₹${amount}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span className={status === "completed" || status === "free" ? "text-green-500" : status === "pending" ? "text-yellow-500" : "text-red-500"}>
          {status === "free" ? "Free Session" : status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      ),
    },
  ];

  const learnerColumns = [
    {
      title: "No.",
      key: "no",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Guide Name",
      dataIndex: "guideName",
      key: "guideName",
      render: (_, record) => record.booking?.guide?.name || "Unknown Guide",
    },
    {
      title: "Service",
      dataIndex: "serviceName",
      key: "serviceName",
      render: (_, record) => record.booking?.service?.title || "Unknown Service",
    },
    {
      title: "Transaction ID",
      dataIndex: "transactionId",
      key: "transactionId",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `₹${amount}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span className={status === "completed" || status === "free" ? "text-green-500" : status === "pending" ? "text-yellow-500" : "text-red-500"}>
          {status === "free" ? "Free Session" : status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      ),
    },
  ];

  const columns = isLearner ? learnerColumns : guideColumns;
  const title = isLearner ? "Payment History" : "Earnings History";
  const subtitle = isLearner ? "Track your session payments" : "Track your earnings from sessions";

  // Add key to payment history items for table
  const tableData = paymentHistory.map((item, index) => ({ ...item, key: item._id || index }));

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          action={
            <button 
              onClick={fetchPaymentData}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Retry
            </button>
          }
        />
      </div>
    );
  }

  return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center mb-4">
          <MdOutlineCurrencyRupee className="mr-2 text-3xl text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-gray-600 text-sm">{subtitle}</p>
          </div>
        </div>
        
        {/* Summary Stats */}
        {isLearner ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-700">Total Spent</h3>
              <p className="text-2xl font-bold text-blue-900">₹{paymentStats.totalSpent || 0}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-700">Sessions Taken</h3>
              <p className="text-2xl font-bold text-green-900">{paymentStats.totalSessions || 0}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-700">Avg. Per Session</h3>
              <p className="text-2xl font-bold text-purple-900">₹{paymentStats.averagePerSession || 0}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-700">Total Earnings</h3>
              <p className="text-2xl font-bold text-green-900">₹{paymentStats.totalEarnings || 0}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-700">Sessions Given</h3>
              <p className="text-2xl font-bold text-blue-900">{paymentStats.totalSessions || 0}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-700">Avg. Per Session</h3>
              <p className="text-2xl font-bold text-purple-900">₹{paymentStats.averagePerSession || 0}</p>
            </div>
          </div>
        )}

        <Table
          columns={columns}
          dataSource={tableData}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20"],
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} transactions`,
          }}
          className="w-full"
        />
      </div>
  );
};

export default Payment;

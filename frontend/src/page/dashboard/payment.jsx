import React from "react";
import { Table } from "antd";
import Dashboard from "./dashboard"; // Layout wrapper for dashboard pages
import { MdOutlineCurrencyRupee } from "react-icons/md";

const Payment = () => {
  // Sample payment data (replace with real API data later)
  const paymentHistory = [
    {
      key: "1",
      no: "1",
      learnerName: "Jane Doe",
      transactionId: "TXN12345",
      date: "2024-10-15",
      amount: "₹50",
      status: "Completed",
    },
    {
      key: "2",
      no: "2",
      learnerName: "Mark Smith",
      transactionId: "TXN67890",
      date: "2024-10-10",
      amount: "₹75",
      status: "Completed",
    },
    {
      key: "3",
      no: "3",
      learnerName: "Anna Johnson",
      transactionId: "TXN24680",
      date: "2024-09-30",
      amount: "₹100",
      status: "Completed",
    },
    {
      key: "4",
      no: "4",
      learnerName: "Emily Davis",
      transactionId: "TXN13579",
      date: "2024-09-25",
      amount: "₹60",
      status: "Completed",
    },
    {
      key: "5",
      no: "5",
      learnerName: "Michael Brown",
      transactionId: "TXN86420",
      date: "2024-09-20",
      amount: "₹85",
      status: "Completed",
    },
    // Add more as needed
  ];

  const columns = [
    {
      title: "No.",
      dataIndex: "no",
      key: "no",
    },
    {
      title: "Learner Name",
      dataIndex: "learnerName",
      key: "learnerName",
    },
    {
      title: "Transaction ID",
      dataIndex: "transactionId",
      key: "transactionId",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span className={status === "Completed" ? "text-green-500" : "text-red-500"}>
          {status}
        </span>
      ),
    },
  ];

  return (
    <Dashboard>
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center mb-4">
          <MdOutlineCurrencyRupee className="mr-2 text-3xl text-blue-600" />
          <h2 className="text-2xl font-bold">Payment History</h2>
        </div>
        <Table
          columns={columns}
          dataSource={paymentHistory}
          pagination={{
            pageSize: 3,
            showSizeChanger: false,
            pageSizeOptions: ["3", "5", "10"],
          }}
          className="w-full"
        />
      </div>
    </Dashboard>
  );
};

export default Payment;

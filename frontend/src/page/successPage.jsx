import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const SuccessPage = () => {
  const [countdown, setCountdown] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    if (countdown === 0) {
      navigate("/");
    }
    return () => clearInterval(timer);
  }, [countdown, navigate]);

  return (
    <Layout>
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="p-10 text-center bg-white rounded shadow-lg">
          <h1 className="text-3xl font-bold text-green-500">Thank You!</h1>
          <p className="mt-4 text-lg">Your booking has been confirmed.</p>
          <p className="mt-2 text-gray-600">
            The meeting link will be shared over your registered email.
          </p>
          <div className="mt-8">
            <div className="text-2xl font-semibold text-blue-500">
              Redirecting in {countdown} seconds...
            </div>
            <div className="relative w-16 h-16 mt-4 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 mt-6 text-white bg-blue-500 rounded hover:bg-blue-400"
          >
            Back to Home
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default SuccessPage;

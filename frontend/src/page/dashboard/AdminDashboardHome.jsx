import React, { useState, useEffect } from "react";
import adminManagement from "../../apiManger/adminManagement";
import toast from "react-hot-toast";

const AdminDashboardHome = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      const response = await adminManagement.getDetailedStats({ period: '30d' });
      console.log('Dashboard stats response:', response.data);
      
      // Handle different response structures
      if (response.data.data && response.data.data.stats) {
        setStats(response.data.data.stats);
      } else if (response.data.stats) {
        setStats(response.data.stats);
      } else {
        console.error('Unexpected response structure:', response.data);
        setStats(null);
      }
    } catch (error) {
      console.error("Error fetching admin dashboard:", error);
      toast.error("Failed to load dashboard statistics");
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats?.users?.total || 0,
      icon: "👥",
      color: "bg-blue-500",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
      subtitle: `+${stats?.users?.newLast30Days || 0} this month`
    },
    {
      title: "Total Guides",
      value: stats?.guides?.total || 0,
      icon: "🎓",
      color: "bg-green-500",
      textColor: "text-green-600",
      bgColor: "bg-green-50",
      subtitle: `${stats?.guides?.approvalRate || 0}% approved`
    },
    {
      title: "Total Bookings",
      value: stats?.bookings?.total || 0,
      icon: "📚",
      color: "bg-purple-500",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50",
      subtitle: `${stats?.bookings?.completionRate || 0}% completed`
    },
    {
      title: "Verified Guides",
      value: stats?.guides?.verified || 0,
      icon: "✅",
      color: "bg-emerald-500",
      textColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
      subtitle: "Active guides"
    },
    {
      title: "Pending Verifications",
      value: stats?.guides?.pending || 0,
      icon: "⏳",
      color: "bg-orange-500",
      textColor: "text-orange-600",
      bgColor: "bg-orange-50",
      subtitle: "Awaiting review"
    },
    {
      title: "Support Tickets",
      value: stats?.supportTickets?.total || 0,
      icon: "🎫",
      color: "bg-indigo-500",
      textColor: "text-indigo-600",
      bgColor: "bg-indigo-50",
      subtitle: `${stats?.supportTickets?.open || 0} open`
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome to Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Monitor and manage your Guidely platform from here.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`${card.bgColor} rounded-lg p-6 border border-gray-200`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {card.title}
                </p>
                <p className={`text-2xl font-bold ${card.textColor}`}>
                  {card.value.toLocaleString()}
                </p>
                {card.subtitle && (
                  <p className="text-xs text-gray-500 mt-1">
                    {card.subtitle}
                  </p>
                )}
              </div>
              <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                <span className="text-white text-xl">{card.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Overview */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            System Overview
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">User Growth Rate</span>
              <span className="text-green-600 font-semibold">+12%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Guide Approval Rate</span>
              <span className="text-blue-600 font-semibold">
                {stats?.totalGuides > 0 
                  ? Math.round((stats.verifiedGuides / stats.totalGuides) * 100) 
                  : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Platform Status</span>
              <span className="text-green-600 font-semibold">✅ Healthy</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = "/dashboard/guide-verifications"}
              className="w-full flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <span className="text-blue-500 mr-3">✅</span>
                <span className="text-gray-700">Review Guide Verifications</span>
              </div>
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                {stats?.pendingVerifications || 0}
              </span>
            </button>
            
            <button
              onClick={() => window.location.href = "/dashboard/users"}
              className="w-full flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <span className="text-green-500 mr-3">👥</span>
                <span className="text-gray-700">Manage Users</span>
              </div>
              <span className="text-gray-400">→</span>
            </button>
            
            <button
              onClick={() => window.location.href = "/dashboard/stats"}
              className="w-full flex items-center justify-between p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <span className="text-purple-500 mr-3">📈</span>
                <span className="text-gray-700">View Detailed Statistics</span>
              </div>
              <span className="text-gray-400">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={fetchDashboardStats}
          disabled={isLoading}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          {isLoading ? "Refreshing..." : "🔄 Refresh Statistics"}
        </button>
      </div>
    </div>
  );
};

export default AdminDashboardHome;
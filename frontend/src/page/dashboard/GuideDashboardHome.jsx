import React from "react";
import { Card, Button, Statistic } from "antd";
import { UserOutlined, CalendarOutlined, DollarOutlined, SettingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const GuideDashboardHome = () => {
  const navigate = useNavigate();

  // Sample data - replace with real API data
  const stats = {
    totalEarnings: 15600,
    thisMonthEarnings: 3200,
    totalSessions: 45,
    upcomingSessions: 8,
    totalLearners: 28,
    activeServices: 6
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Welcome Back, Guide! 👨‍🏫</h1>
        <p className="text-green-100">Help learners achieve their goals and grow your expertise.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <Statistic
            title="Total Earnings"
            value={stats.totalEarnings}
            prefix="₹"
            valueStyle={{ color: '#3f8600' }}
          />
        </Card>
        <Card>
          <Statistic
            title="This Month"
            value={stats.thisMonthEarnings}
            prefix="₹"
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
        <Card>
          <Statistic
            title="Total Sessions"
            value={stats.totalSessions}
            prefix={<CalendarOutlined className="text-purple-500" />}
          />
        </Card>
        <Card>
          <Statistic
            title="Upcoming Sessions"
            value={stats.upcomingSessions}
            prefix={<CalendarOutlined className="text-orange-500" />}
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Overview */}
        <Card title="Performance Overview">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Total Learners</span>
              <span className="font-bold text-lg">{stats.totalLearners}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Active Services</span>
              <span className="font-bold text-lg">{stats.activeServices}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Average Rating</span>
              <span className="font-bold text-lg">4.8 ⭐</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Response Rate</span>
              <span className="font-bold text-lg">95%</span>
            </div>
          </div>
        </Card>

        {/* Free Sessions Guide */}
        <Card 
          title="🎉 Free Sessions" 
          extra={
            <Button 
              type="primary" 
              size="small"
              onClick={() => navigate("/dashboard/services")}
              className="bg-green-600 hover:bg-green-700 border-green-600"
            >
              Create Free Service
            </Button>
          }
          className="border-green-300"
        >
          <div className="space-y-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-green-800">Perfect for Platform Testing!</p>
              <p className="text-xs text-green-600 mt-1">
                Create free sessions to test booking flow, gather reviews, and build your reputation.
              </p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                <span>No payment integration needed</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                <span>Instant booking confirmation</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                <span>Build reviews & reputation</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                <span>Test session management</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card title="Recent Activity">
          <div className="space-y-3">
            <div className="border-l-4 border-blue-500 pl-3">
              <p className="font-medium">New booking received</p>
              <p className="text-sm text-gray-600">React Advanced Patterns - 2 hours ago</p>
            </div>
            <div className="border-l-4 border-green-500 pl-3">
              <p className="font-medium">Free session completed</p>
              <p className="text-sm text-gray-600">JavaScript Fundamentals - 5 hours ago</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-3">
              <p className="font-medium">Payment received</p>
              <p className="text-sm text-gray-600">₹120 for Node.js session - 1 day ago</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button 
            type="primary" 
            size="large" 
            icon={<SettingOutlined />}
            onClick={() => navigate("/dashboard/services")}
            block
          >
            Manage Services
          </Button>
          <Button 
            size="large" 
            icon={<CalendarOutlined />}
            onClick={() => navigate("/dashboard/schedule")}
            block
          >
            Set Schedule
          </Button>
          <Button 
            size="large" 
            icon={<UserOutlined />}
            onClick={() => navigate("/dashboard/bookings")}
            block
          >
            View Bookings
          </Button>
          <Button 
            size="large" 
            icon={<DollarOutlined />}
            onClick={() => navigate("/dashboard/payment")}
            block
          >
            Earnings
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default GuideDashboardHome;

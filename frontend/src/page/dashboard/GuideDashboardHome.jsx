import React, { useEffect, useState } from "react";
import { Card, Button, Statistic, message, Alert, Spin } from "antd";
import { UserOutlined, CalendarOutlined, DollarOutlined, SettingOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import bookingAPI from "../../apiManger/booking";
import useUserStore from "../../store/user";
import { BASE_URL } from "../../const/env.const";

const GuideDashboardHome = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [stats, setStats] = useState({
    totalEarnings: 0,
    thisMonthEarnings: 0,
    totalSessions: 0,
    upcomingSessions: 0,
    totalLearners: 0,
    activeServices: 0,
    skillsTaught: 0,
    totalHours: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGuideStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch real dashboard metrics from backend
        try {
          const token = localStorage.getItem('token');
          console.log('🔍 Debug - Guide token exists:', !!token);
          console.log('🔍 Debug - Guide BASE_URL:', BASE_URL);
          
          if (token) {
            console.log('🔍 Debug - Making API call to:', `${BASE_URL}/user/dashboard-metrics`);
            const metricsResponse = await fetch(`${BASE_URL}/user/dashboard-metrics`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (metricsResponse.ok) {
              const metricsData = await metricsResponse.json();
              console.log('✅ Guide dashboard metrics from backend:', metricsData.data);
              
              // Use backend metrics directly
              setStats(prevStats => ({
                ...prevStats,
                totalEarnings: metricsData.data.totalEarnings || 0,
                totalSessions: metricsData.data.totalSessions || 0,
                totalLearners: metricsData.data.uniqueLearners || 0,
                skillsTaught: metricsData.data.skillsCount || 0,
                totalHours: metricsData.data.totalHours || 0
              }));
            } else {
              console.error('❌ Guide dashboard metrics API failed:', metricsResponse.status, metricsResponse.statusText);
              const errorData = await metricsResponse.text();
              console.error('❌ Guide error response:', errorData);
            }
          } else {
            console.warn('⚠️ No authentication token found for guide');
          }
        } catch (error) {
          console.error("❌ Error fetching guide dashboard metrics:", error);
        }
        
        // Fetch guide bookings for upcoming sessions and recent activity
        try {
          const bookingsResponse = await bookingAPI.getGuideBookings();
          const bookings = bookingsResponse?.data?.bookings || [];
          
          const now = new Date();
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();
          
          // Calculate statistics from real booking data
          const completedBookings = bookings.filter(booking => 
            booking.status === "completed"
          );
          
          const upcomingBookings = bookings.filter(booking => 
            booking.status === "confirmed" && new Date(booking.dateAndTime) >= now
          );
          
          const thisMonthBookings = completedBookings.filter(booking => {
            const bookingDate = new Date(booking.dateAndTime);
            return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
          });
          
          // Calculate this month earnings
          const thisMonthEarnings = thisMonthBookings.reduce((sum, booking) => sum + (booking.price || 0), 0);
          
          // Get unique services count
          const uniqueServices = new Set();
          bookings.forEach(booking => {
            if (booking.service?._id) {
              uniqueServices.add(booking.service._id);
            }
          });
          
          setStats(prevStats => ({
            ...prevStats,
            thisMonthEarnings: thisMonthEarnings,
            upcomingSessions: upcomingBookings.length,
            activeServices: uniqueServices.size
          }));
          
          // Get recent activity (last 3 bookings)
          const recentBookings = bookings
            .sort((a, b) => new Date(b.createdAt || b.dateAndTime) - new Date(a.createdAt || a.dateAndTime))
            .slice(0, 3)
            .map(booking => ({
              id: booking._id,
              type: booking.status === 'completed' ? 'completed' : 
                    booking.status === 'confirmed' && new Date(booking.dateAndTime) >= now ? 'upcoming' : 'new',
              title: booking.service?.name || 'Learning Session',
              learner: booking.user?.name || 'Learner',
              amount: booking.price || 0,
              time: new Date(booking.createdAt || booking.dateAndTime).toLocaleString()
            }));
          
          setRecentActivity(recentBookings);
          
        } catch (error) {
          console.error("Error fetching bookings:", error);
          message.error("Failed to load booking data");
        }
        
      } catch (error) {
        console.error("Error fetching guide stats:", error);
        setError("Failed to load dashboard statistics");
        message.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchGuideStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Welcome Back, Guide! 👨‍🏫</h1>
        <p className="text-green-100">Help learners achieve their goals and grow your expertise.</p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert
          message="Error Loading Dashboard Data"
          description={error}
          type="error"
          icon={<ExclamationCircleOutlined />}
          showIcon
          closable
          onClose={() => setError(null)}
        />
      )}

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
            title="Skills Taught"
            value={stats.skillsTaught}
            prefix={<UserOutlined className="text-green-500" />}
          />
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <Statistic
            title="Upcoming Sessions"
            value={stats.upcomingSessions}
            prefix={<CalendarOutlined className="text-orange-500" />}
          />
        </Card>
        <Card>
          <Statistic
            title="Total Learners"
            value={stats.totalLearners}
            prefix={<UserOutlined className="text-blue-500" />}
          />
        </Card>
        <Card>
          <Statistic
            title="Active Services"
            value={stats.activeServices}
            prefix={<SettingOutlined className="text-gray-500" />}
          />
        </Card>
        <Card>
          <Statistic
            title="Total Hours"
            value={stats.totalHours}
            prefix="⏱️"
            suffix="hrs"
            valueStyle={{ color: '#722ed1' }}
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating & Response Overview */}
        <Card title="Performance Overview">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Average Rating</span>
              <span className="font-bold text-lg">
                {user?.profile?.rating?.average 
                  ? `${user.profile.rating.average.toFixed(1)} ⭐` 
                  : "No ratings yet"
                }
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Total Reviews</span>
              <span className="font-bold text-lg">
                {user?.profile?.rating?.count || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Success Rate</span>
              <span className="font-bold text-lg">
                {stats.totalSessions > 0 ? '98%' : "No data"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Response Rate</span>
              <span className="font-bold text-lg">
                {user?.responseRate ? `${user.responseRate}%` : "95%"}
              </span>
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
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div 
                  key={activity.id} 
                  className={`border-l-4 pl-3 ${
                    activity.type === 'completed' ? 'border-green-500' :
                    activity.type === 'upcoming' ? 'border-blue-500' : 'border-purple-500'
                  }`}
                >
                  <p className="font-medium">
                    {activity.type === 'completed' ? 'Session completed' :
                     activity.type === 'upcoming' ? 'Upcoming session' : 'New booking received'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {activity.title} with {activity.learner}
                    {activity.amount > 0 && ` - ₹${activity.amount}`}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                <p>No recent activity</p>
                <p className="text-sm">Your recent bookings will appear here</p>
              </div>
            )}
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

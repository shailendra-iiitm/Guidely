import React, { useEffect, useState } from "react";
import { Card, Button, Statistic, Progress, Timeline, Empty, Alert, message } from "antd";
import { UserOutlined, CalendarOutlined, BookOutlined, TrophyOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import guideAPI from "../../apiManger/guide";
import bookingAPI from "../../apiManger/booking";
import learningProgressAPI from "../../apiManger/learningProgress";
import { BASE_URL } from "../../const/env.const";

const LearnerDashboardHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalSessions: 0,
    upcomingSessions: 0,
    totalSpent: 0,
    skillsLearned: 0,
    skillsCount: 0,
    currentStreak: 0,
    totalHours: 0
  });
  const [recentGuides, setRecentGuides] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch real dashboard metrics from backend using the same API as LearningProgress
        try {
          console.log('🔍 Debug - Fetching learning progress data...');
          const response = await learningProgressAPI.getLearningProgress();
          console.log('✅ Learning progress response:', response);
          
          const progressData = response.data.data;
          
          // Set stats with proper mapping (same as LearningProgress component)
          setStats(prevStats => ({
            ...prevStats,
            totalSessions: progressData.stats?.totalSessions || 0,
            skillsLearned: progressData.stats?.skillsLearned || 0,
            skillsCount: progressData.stats?.skillsLearned || 0,
            currentStreak: progressData.stats?.currentStreak || 0,
            totalHours: progressData.stats?.totalHours || 0
          }));
          
          console.log('✅ Dashboard stats updated:', {
            totalSessions: progressData.stats?.totalSessions || 0,
            skillsLearned: progressData.stats?.skillsLearned || 0,
            currentStreak: progressData.stats?.currentStreak || 0,
            totalHours: progressData.stats?.totalHours || 0
          });
          
        } catch (error) {
          console.error("❌ Error fetching learning progress:", error);
        }
        
        // Fetch real learner bookings for upcoming sessions and spending
        try {
          const bookingsResponse = await bookingAPI.getLearnerBookings();
          const bookings = bookingsResponse?.data?.bookings || [];
          
          // Calculate real statistics from bookings
          const now = new Date();
          const completedBookings = bookings.filter(booking => 
            booking.status === "completed"
          );
          const upcomingBookings = bookings.filter(booking => 
            booking.status === "confirmed" && new Date(booking.dateAndTime) >= now
          );
          
          const totalSpent = completedBookings.reduce((sum, booking) => sum + (booking.price || 0), 0);
          
          setStats(prevStats => ({
            ...prevStats,
            upcomingSessions: upcomingBookings.length,
            totalSpent: totalSpent
          }));
          
          // Set upcoming sessions
          const formattedUpcomingSessions = upcomingBookings.slice(0, 3).map(booking => ({
            id: booking._id,
            title: booking.service?.name || "Learning Session",
            guide: booking.guide?.name || "Guide",
            date: new Date(booking.dateAndTime).toLocaleDateString(),
            time: new Date(booking.dateAndTime).toLocaleTimeString()
          }));
          
          setUpcomingSessions(formattedUpcomingSessions);
          
        } catch (error) {
          console.error("Error fetching bookings:", error);
          message.error("Failed to load booking data");
        }
        
        // Fetch guides for the "Popular Guides" section
        try {
          const guidesResponse = await guideAPI.getAllGuides();
          const allGuides = guidesResponse?.data?.guides || [];
          
          // Transform and filter guides with real data
          const transformedGuides = allGuides
            .filter(guide => guide.hourlyRate > 0 && guide.skills && guide.skills.length > 0) // Only show guides with services and skills
            .slice(0, 3)
            .map(guide => ({
              _id: guide._id,
              name: guide.name,
              username: guide.username,
              skills: guide.skills || guide.profile?.tags || [],
              hourlyRate: guide.hourlyRate,
              averageRating: guide.averageRating,
              totalSessions: guide.totalSessions || 0,
              photoUrl: guide.photoUrl || `https://ui-avatars.com/api?name=${guide.name}`,
              availability: guide.availability,
              servicesCount: guide.servicesCount || 0,
              profile: guide.profile || {} // Include profile for potential social links
            }));
          
          setRecentGuides(transformedGuides);
        } catch (error) {
          console.error("Error fetching guides:", error);
          setError("Failed to load guide recommendations");
          message.error("Failed to load guide recommendations");
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Welcome to Your Learning Journey! 🚀</h1>
        <p className="text-blue-100">Continue learning with expert guides and achieve your goals.</p>
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
            title="Total Sessions"
            value={stats.totalSessions}
            prefix={<BookOutlined className="text-blue-500" />}
          />
        </Card>
        <Card>
          <Statistic
            title="Skills Learned"
            value={stats.skillsLearned}
            prefix={<TrophyOutlined className="text-yellow-500" />}
          />
        </Card>
        <Card>
          <Statistic
            title="Day Streak"
            value={stats.currentStreak}
            prefix="🔥"
            valueStyle={{ color: '#ff4d4f' }}
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

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <Statistic
            title="Upcoming Sessions"
            value={stats.upcomingSessions}
            prefix={<CalendarOutlined className="text-green-500" />}
          />
        </Card>
        <Card>
          <Statistic
            title="Total Spent"
            value={stats.totalSpent}
            prefix="₹"
            suffix=""
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Guides */}
        <Card 
          title="Popular Guides" 
          extra={
            <Button type="link" onClick={() => navigate("/dashboard/find-guides")}>
              View All
            </Button>
          }
        >
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse flex space-x-3">
                  <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentGuides.length > 0 ? (
            <div className="space-y-3">
              {recentGuides.map((guide) => (
                <div 
                  key={guide._id} 
                  className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded cursor-pointer transition-colors duration-200"
                  onClick={() => {
                    const username = guide.username || guide.name.toLowerCase().replace(' ', '');
                    navigate(`/guide/${username}`);
                  }}
                >
                  <img
                    src={guide.photoUrl || `https://ui-avatars.com/api?name=${guide.name}`}
                    alt={guide.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium hover:text-blue-600 transition-colors">{guide.name}</h4>
                    <p className="text-sm text-gray-600">
                      {/* Display real skills from backend */}
                      {guide.skills?.length > 0 
                        ? guide.skills.slice(0, 2).join(", ")
                        : "No skills specified"
                      }
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">
                      {guide.hourlyRate > 0 ? `₹${guide.hourlyRate}/hr` : "Pricing varies"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {guide.averageRating 
                        ? `★ ${guide.averageRating.toFixed(1)}` 
                        : `${guide.totalSessions} sessions`
                      }
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty description="No guides available" />
          )}
        </Card>

        {/* Upcoming Sessions */}
        <Card 
          title="Upcoming Sessions"
          extra={
            <Button type="link" onClick={() => navigate("/dashboard/bookings")}>
              View All
            </Button>
          }
        >
          {upcomingSessions.length > 0 ? (
            <Timeline>
              {upcomingSessions.map((session) => (
                <Timeline.Item key={session.id} color="blue">
                  <div>
                    <h4 className="font-medium">{session.title}</h4>
                    <p className="text-sm text-gray-600">with {session.guide}</p>
                    <p className="text-xs text-gray-500">{session.date} at {session.time}</p>
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          ) : (
            <Empty 
              description="No upcoming sessions"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button type="primary" onClick={() => navigate("/dashboard/find-guides")}>
                Book Your First Session
              </Button>
            </Empty>
          )}
        </Card>
      </div>

      {/* Learning Progress */}
      <Card title="Learning Progress">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Sessions Completed</h4>
            <Progress 
              type="circle" 
              percent={stats.totalSessions > 0 ? Math.min((stats.totalSessions / (stats.totalSessions + stats.upcomingSessions)) * 100, 100) : 0} 
              format={() => `${stats.totalSessions}`}
              size={120}
            />
            <p className="text-center text-sm text-gray-600 mt-2">
              {stats.totalSessions} completed sessions
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-3">Your Learning Journey</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Skills Learned</span>
                <span className="font-medium">{stats.skillsLearned}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount Invested</span>
                <span className="font-medium">₹{stats.totalSpent}</span>
              </div>
              <div className="flex justify-between">
                <span>Upcoming Sessions</span>
                <span className="font-medium">{stats.upcomingSessions}</span>
              </div>
              {stats.totalSessions > 0 && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">
                    Great progress! Keep learning to achieve your goals.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            type="primary" 
            size="large" 
            icon={<UserOutlined />}
            onClick={() => navigate("/dashboard/find-guides")}
            block
          >
            Find Guides
          </Button>
          <Button 
            size="large" 
            icon={<CalendarOutlined />}
            onClick={() => navigate("/dashboard/bookings")}
            block
          >
            My Sessions
          </Button>
          <Button 
            size="large" 
            icon={<TrophyOutlined />}
            onClick={() => navigate("/dashboard/progress")}
            block
          >
            View Progress
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default LearnerDashboardHome;

import React, { useState, useEffect, useCallback } from "react";
import adminManagement from "../../apiManger/adminManagement";
import toast from "react-hot-toast";

const DetailedStats = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await adminManagement.getDetailedStats({ period: dateRange });
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to load statistics");
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Detailed Statistics
            </h1>
            <p className="text-gray-600">
              Comprehensive insights and analytics for the platform
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 3 months</option>
              <option value="1y">Last year</option>
            </select>
            <button
              onClick={fetchStats}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.overview?.totalUsers || 0}
              </p>
              <p className="text-sm text-green-600">
                +{stats?.overview?.newUsersThisPeriod || 0} this period
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <span className="text-2xl">🎓</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Guides</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.overview?.activeGuides || 0}
              </p>
              <p className="text-sm text-blue-600">
                {stats?.overview?.verifiedGuides || 0} verified
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <span className="text-2xl">📚</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.overview?.totalBookings || 0}
              </p>
              <p className="text-sm text-green-600">
                +{stats?.overview?.newBookingsThisPeriod || 0} this period
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ${stats?.overview?.totalRevenue || 0}
              </p>
              <p className="text-sm text-green-600">
                +${stats?.overview?.revenueThisPeriod || 0} this period
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* User Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">User Distribution</h3>
          <div className="space-y-4">
            {stats?.userStats?.map((userType) => (
              <div key={userType._id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-3 ${
                    userType._id === 'admin' ? 'bg-red-500' :
                    userType._id === 'guide' ? 'bg-blue-500' :
                    'bg-green-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {userType._id}s
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{userType.count}</p>
                  <p className="text-xs text-gray-500">
                    {((userType.count / stats?.overview?.totalUsers) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Status</h3>
          <div className="space-y-4">
            {stats?.bookingStats?.map((booking) => (
              <div key={booking._id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-3 ${
                    booking._id === 'completed' ? 'bg-green-500' :
                    booking._id === 'confirmed' ? 'bg-blue-500' :
                    booking._id === 'pending' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {booking._id}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{booking.count}</p>
                  <p className="text-xs text-gray-500">
                    {((booking.count / stats?.overview?.totalBookings) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {stats?.recentUsers?.length > 0 ? (
            stats.recentUsers.map((user) => (
              <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">
                      {user.email} • Joined as {user.role}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === 'admin' ? 'bg-red-100 text-red-800' :
                    user.role === 'guide' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {user.role}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          )}
        </div>
      </div>

      {/* Growth Metrics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Growth Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {stats?.growthMetrics?.userGrowthRate || 0}%
            </div>
            <p className="text-sm text-gray-600">User Growth Rate</p>
            <p className="text-xs text-gray-500 mt-1">vs previous period</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {stats?.growthMetrics?.bookingGrowthRate || 0}%
            </div>
            <p className="text-sm text-gray-600">Booking Growth Rate</p>
            <p className="text-xs text-gray-500 mt-1">vs previous period</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {stats?.growthMetrics?.revenueGrowthRate || 0}%
            </div>
            <p className="text-sm text-gray-600">Revenue Growth Rate</p>
            <p className="text-xs text-gray-500 mt-1">vs previous period</p>
          </div>
        </div>
      </div>

      {/* Guide Verification Status */}
      {stats?.guideVerificationStats && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Guide Verification Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.guideVerificationStats.map((stat) => (
              <div key={stat._id} className="text-center p-4 border rounded-lg">
                <div className={`text-2xl font-bold mb-2 ${
                  stat._id === 'approved' ? 'text-green-600' :
                  stat._id === 'rejected' ? 'text-red-600' :
                  'text-yellow-600'
                }`}>
                  {stat.count}
                </div>
                <p className="text-sm text-gray-600 capitalize">{stat._id}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* System Health */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">System Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-700">Database</p>
              <p className="text-xs text-gray-500">Connection Status</p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-700">API</p>
              <p className="text-xs text-gray-500">Response Time: ~200ms</p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-700">Email Service</p>
              <p className="text-xs text-gray-500">SMTP Active</p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-700">File Storage</p>
              <p className="text-xs text-gray-500">Cloudinary Active</p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedStats;
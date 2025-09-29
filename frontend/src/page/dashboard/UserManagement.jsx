import React, { useState, useEffect, useCallback } from "react";
import adminManagement from "../../apiManger/adminManagement";
import toast from "react-hot-toast";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    role: '',
    status: '',
    search: ''
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await adminManagement.getAllUsers(filters);
      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const openUserModal = async (user) => {
    try {
      const response = await adminManagement.getUserById(user._id);
      setSelectedUser(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Failed to load user details");
    }
  };

  const closeUserModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const handleStatusUpdate = async (userId, updateData) => {
    try {
      setIsUpdating(true);
      await adminManagement.updateUserStatus(userId, updateData);
      toast.success("User status updated successfully");
      fetchUsers();
      closeUserModal();
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBlockUnblock = async (userId, isBlocked) => {
    try {
      setIsUpdating(true);
      await adminManagement.updateUserStatus(userId, { 
        isBlocked: !isBlocked 
      });
      toast.success(`User ${!isBlocked ? 'blocked' : 'unblocked'} successfully`);
      fetchUsers();
      closeUserModal();
    } catch (error) {
      console.error("Error updating user block status:", error);
      toast.error("Failed to update user block status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    try {
      await adminManagement.deleteUser(userId);
      toast.success("User deleted successfully");
      fetchUsers();
      closeUserModal();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'guide': return 'bg-blue-100 text-blue-800';
      case 'learner': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (verified) => {
    return verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              User Management
            </h1>
            <p className="text-gray-600">
              Manage all users, guides, and learners in the system
            </p>
          </div>
          <button
            onClick={fetchUsers}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search by name, email, username..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="guide">Guide</option>
              <option value="learner">Learner</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Per Page
            </label>
            <select
              value={filters.limit}
              onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {user.name?.charAt(0)?.toUpperCase() || "U"}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                            <div className="text-xs text-gray-400">
                              @{user.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.verified)}`}>
                            {user.verified ? 'Verified' : 'Unverified'}
                          </span>
                          {user.isBlocked && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                              Blocked
                            </span>
                          )}
                          {user.role === 'guide' && user.guideVerification && (
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.guideVerification.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                              user.guideVerification.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              Guide: {user.guideVerification.status}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openUserModal(user)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{' '}
                      <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span>
                      {' '}to{' '}
                      <span className="font-medium">
                        {Math.min(pagination.page * pagination.limit, pagination.total)}
                      </span>
                      {' '}of{' '}
                      <span className="font-medium">{pagination.total}</span>
                      {' '}results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === pagination.page
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* User Details Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">User Details</h3>
              <button
                onClick={closeUserModal}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {selectedUser.user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold">{selectedUser.user?.name}</h4>
                  <p className="text-gray-600">{selectedUser.user?.email}</p>
                  <p className="text-sm text-gray-500">@{selectedUser.user?.username}</p>
                </div>
              </div>

              {/* User Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(selectedUser.user?.role)}`}>
                    {selectedUser.user?.role}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedUser.user?.verified)}`}>
                    {selectedUser.user?.verified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Joined</label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedUser.user?.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedUser.user?.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Guide Verification Info */}
              {selectedUser.user?.role === 'guide' && selectedUser.user?.guideVerification && (
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-gray-800 mb-2">Guide Verification</h5>
                  <div className="space-y-2">
                    <p><strong>Status:</strong> {selectedUser.user.guideVerification.status}</p>
                    {selectedUser.user.guideVerification.submittedAt && (
                      <p><strong>Submitted:</strong> {new Date(selectedUser.user.guideVerification.submittedAt).toLocaleDateString()}</p>
                    )}
                    {selectedUser.user.guideVerification.reviewComments && (
                      <p><strong>Comments:</strong> {selectedUser.user.guideVerification.reviewComments}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Recent Bookings */}
              {selectedUser.bookings && selectedUser.bookings.length > 0 && (
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-gray-800 mb-3">Recent Bookings</h5>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedUser.bookings.map((booking) => (
                      <div key={booking._id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <p className="text-sm font-medium">
                            {selectedUser.user?.role === 'guide' ? booking.user?.name : booking.guide?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                {/* Verification only for guides */}
                {selectedUser.user?.role === 'guide' && (
                  <button
                    onClick={() => handleStatusUpdate(selectedUser.user?._id, { 
                      verified: !selectedUser.user?.verified 
                    })}
                    disabled={isUpdating}
                    className={`px-4 py-2 rounded-lg text-white transition-colors disabled:opacity-50 ${
                      selectedUser.user?.verified 
                        ? 'bg-yellow-500 hover:bg-yellow-600' 
                        : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    {isUpdating ? 'Updating...' : (selectedUser.user?.verified ? 'Unverify' : 'Verify')}
                  </button>
                )}
                
                {/* Block/Unblock for all non-admin users */}
                {selectedUser.user?.role !== 'admin' && (
                  <button
                    onClick={() => handleBlockUnblock(selectedUser.user?._id, selectedUser.user?.isBlocked)}
                    disabled={isUpdating}
                    className={`px-4 py-2 rounded-lg text-white transition-colors disabled:opacity-50 ${
                      selectedUser.user?.isBlocked 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : 'bg-orange-500 hover:bg-orange-600'
                    }`}
                  >
                    {isUpdating ? 'Updating...' : (selectedUser.user?.isBlocked ? 'Unblock' : 'Block')}
                  </button>
                )}
                
                {selectedUser.user?.role !== 'admin' && (
                  <button
                    onClick={() => handleDeleteUser(selectedUser.user?._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Delete User
                  </button>
                )}
                
                <button
                  onClick={closeUserModal}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
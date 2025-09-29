import React, { useState, useEffect, useCallback } from "react";
import supportTickets from "../../apiManger/supportTickets";
import toast from "react-hot-toast";

const SupportTicketManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: '',
    priority: '',
    category: '',
    search: ''
  });
  const [pagination, setPagination] = useState({});
  const [stats, setStats] = useState(null);

  const fetchTickets = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await supportTickets.getAllTickets(filters);
      setTickets(response.data.tickets);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error("Failed to load support tickets");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const fetchStats = async () => {
    try {
      const response = await supportTickets.getTicketStats({ period: '30d' });
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching ticket stats:", error);
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchStats();
  }, [fetchTickets]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const openTicketModal = async (ticket) => {
    try {
      const response = await supportTickets.getTicketById(ticket._id);
      setSelectedTicket(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching ticket details:", error);
      toast.error("Failed to load ticket details");
    }
  };

  const closeTicketModal = () => {
    setSelectedTicket(null);
    setIsModalOpen(false);
    setNewMessage('');
  };

  const handleStatusUpdate = async (ticketId, status) => {
    try {
      setIsUpdating(true);
      await supportTickets.updateTicketStatus(ticketId, { status });
      toast.success(`Ticket ${status} successfully`);
      fetchTickets();
      if (selectedTicket) {
        const updatedTicket = await supportTickets.getTicketById(ticketId);
        setSelectedTicket(updatedTicket.data);
      }
    } catch (error) {
      console.error("Error updating ticket status:", error);
      toast.error("Failed to update ticket status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddMessage = async () => {
    if (!newMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }

    try {
      setIsUpdating(true);
      await supportTickets.addMessage(selectedTicket._id, { message: newMessage });
      toast.success("Message added successfully");
      setNewMessage('');
      
      // Refresh ticket details
      const updatedTicket = await supportTickets.getTicketById(selectedTicket._id);
      setSelectedTicket(updatedTicket.data);
    } catch (error) {
      console.error("Error adding message:", error);
      toast.error("Failed to add message");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Support Ticket Management
            </h1>
            <p className="text-gray-600">
              Manage and respond to user support requests
            </p>
          </div>
          <button
            onClick={() => { fetchTickets(); fetchStats(); }}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Quick Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🎫</span>
                <div>
                  <p className="text-sm text-gray-600">Total Tickets</p>
                  <p className="text-xl font-bold text-blue-600">{stats.overview?.totalTickets || 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center">
                <span className="text-2xl mr-3">⏳</span>
                <div>
                  <p className="text-sm text-gray-600">Open Tickets</p>
                  <p className="text-xl font-bold text-yellow-600">
                    {stats.statusStats?.find(s => s._id === 'open')?.count || 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <span className="text-2xl mr-3">✅</span>
                <div>
                  <p className="text-sm text-gray-600">Resolved</p>
                  <p className="text-xl font-bold text-green-600">
                    {stats.statusStats?.find(s => s._id === 'resolved')?.count || 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center">
                <span className="text-2xl mr-3">⚡</span>
                <div>
                  <p className="text-sm text-gray-600">Avg Response</p>
                  <p className="text-xl font-bold text-purple-600">
                    {Math.round(stats.metrics?.avgResponseTime || 0)}m
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search tickets..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="general">General</option>
              <option value="technical">Technical</option>
              <option value="billing">Billing</option>
              <option value="booking">Booking</option>
              <option value="account">Account</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Per Page</label>
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

      {/* Tickets Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎫</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No support tickets</h3>
            <p className="text-gray-500">No tickets match your current filters.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ticket
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tickets.map((ticket) => (
                    <tr key={ticket._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {ticket.ticketId}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {ticket.subject}
                          </div>
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                            {ticket.category}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xs">
                              {ticket.user?.name?.charAt(0)?.toUpperCase() || "U"}
                            </span>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {ticket.user?.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {ticket.user?.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openTicketModal(ticket)}
                          className="text-blue-600 hover:text-blue-900"
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
                      Showing <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
                      <span className="font-medium">{pagination.total}</span> results
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

      {/* Ticket Details Modal */}
      {isModalOpen && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold">{selectedTicket.ticketId}</h3>
                <p className="text-gray-600">{selectedTicket.subject}</p>
              </div>
              <button onClick={closeTicketModal} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Ticket Info */}
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3">Ticket Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Status:</strong> 
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(selectedTicket.status)}`}>
                        {selectedTicket.status}
                      </span>
                    </div>
                    <div><strong>Priority:</strong> 
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getPriorityColor(selectedTicket.priority)}`}>
                        {selectedTicket.priority}
                      </span>
                    </div>
                    <div><strong>Category:</strong> {selectedTicket.category}</div>
                    <div><strong>Created:</strong> {new Date(selectedTicket.createdAt).toLocaleString()}</div>
                    <div><strong>User:</strong> {selectedTicket.user?.name} ({selectedTicket.user?.email})</div>
                  </div>
                </div>

                {/* Status Actions */}
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-800">Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleStatusUpdate(selectedTicket._id, 'in-progress')}
                      disabled={isUpdating || selectedTicket.status === 'in-progress'}
                      className="px-3 py-2 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 disabled:opacity-50"
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedTicket._id, 'resolved')}
                      disabled={isUpdating || selectedTicket.status === 'resolved'}
                      className="px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50"
                    >
                      Resolve
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="lg:col-span-2">
                <h4 className="font-medium text-gray-800 mb-4">Conversation</h4>
                <div className="border rounded-lg max-h-96 overflow-y-auto mb-4">
                  {selectedTicket.messages?.map((message, index) => (
                    <div key={index} className={`p-4 border-b ${message.senderType === 'admin' ? 'bg-blue-50' : 'bg-gray-50'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium text-sm">
                          {message.senderType === 'admin' ? '🛡️ Admin' : '👤 User'} - {message.sender?.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(message.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-sm text-gray-700">{message.message}</div>
                    </div>
                  ))}
                </div>

                {/* Add New Message */}
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-gray-800 mb-2">Add Response</h5>
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your response..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={handleAddMessage}
                      disabled={isUpdating || !newMessage.trim()}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                    >
                      {isUpdating ? 'Sending...' : 'Send Response'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportTicketManagement;
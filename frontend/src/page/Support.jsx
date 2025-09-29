import React, { useState, useEffect } from "react";
import supportTickets from "../apiManger/supportTickets";
import toast from "react-hot-toast";

const Support = () => {
  const [activeTab, setActiveTab] = useState('submit');
  const [myTickets, setMyTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    category: 'general',
    priority: 'medium'
  });

  useEffect(() => {
    if (activeTab === 'tickets') {
      fetchMyTickets();
    }
  }, [activeTab]);

  const fetchMyTickets = async () => {
    try {
      setIsLoading(true);
      const response = await supportTickets.getMyTickets();
      setMyTickets(response.data.tickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error("Failed to load your tickets");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.subject.trim() || !formData.description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsLoading(true);
      await supportTickets.createTicket(formData);
      toast.success("Support ticket submitted successfully!");
      setFormData({
        subject: '',
        description: '',
        category: 'general',
        priority: 'medium'
      });
      setActiveTab('tickets');
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast.error("Failed to submit ticket. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🎧 Guidely Support Center
            </h1>
            <p className="text-gray-600">
              Need help with mentoring, bookings, or platform features? Our support team is here to guide you through any issues.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mt-6">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('submit')}
                className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'submit'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Submit Ticket
              </button>
              <button
                onClick={() => setActiveTab('tickets')}
                className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'tickets'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                My Tickets
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'submit' ? (
          /* Submit Ticket Form */
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Submit Support Ticket</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Issue</option>
                    <option value="billing">Billing & Payments</option>
                    <option value="booking">Booking & Scheduling</option>
                    <option value="account">Account & Profile</option>
                    <option value="mentoring">Mentoring Sessions</option>
                    <option value="verification">Guide Verification</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Brief description of your issue"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Please describe your issue in detail. Include any error messages, steps you took, or specific features you need help with..."
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* My Tickets */
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">My Support Tickets</h2>
                <button
                  onClick={fetchMyTickets}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
                >
                  🔄 Refresh
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : myTickets.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎫</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No support tickets</h3>
                <p className="text-gray-500 mb-4">You haven't submitted any support tickets yet.</p>
                <button
                  onClick={() => setActiveTab('submit')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Submit Your First Ticket
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {myTickets.map((ticket) => (
                  <div key={ticket._id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            {ticket.ticketId}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                            {ticket.status}
                          </span>
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                            {ticket.category}
                          </span>
                        </div>
                        <h4 className="text-sm font-medium text-gray-800 mb-2">
                          {ticket.subject}
                        </h4>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {ticket.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                          <span>Messages: {ticket.messages?.length || 0}</span>
                          {ticket.lastResponseAt && (
                            <span>Last Response: {new Date(ticket.lastResponseAt).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          ticket.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          ticket.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {ticket.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Help & Support Information */}
        <div className="mt-8 space-y-6">
          {/* Quick Help Resources */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                🚀 Quick Help Resources
              </h3>
              <p className="text-gray-600">
                Before submitting a ticket, check out these helpful resources
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-2xl mb-2">📚</div>
                <h4 className="font-medium text-gray-900 mb-1">User Guide</h4>
                <p className="text-xs text-gray-600">Learn platform features</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-2xl mb-2">🎓</div>
                <h4 className="font-medium text-gray-900 mb-1">Mentor Guide</h4>
                <p className="text-xs text-gray-600">Guide verification help</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-2xl mb-2">💡</div>
                <h4 className="font-medium text-gray-900 mb-1">FAQ</h4>
                <p className="text-xs text-gray-600">Common questions</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-2xl mb-2">🎥</div>
                <h4 className="font-medium text-gray-900 mb-1">Tutorials</h4>
                <p className="text-xs text-gray-600">Step-by-step guides</p>
              </div>
            </div>
          </div>

          {/* Support Ticket Process */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📋 How Our Support System Works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Submit Ticket</h4>
                <p className="text-sm text-gray-600">Describe your issue with details</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-yellow-600 font-bold">2</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Admin Review</h4>
                <p className="text-sm text-gray-600">Our team reviews your request</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Get Response</h4>
                <p className="text-sm text-gray-600">Receive help from our experts</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold">4</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Resolution</h4>
                <p className="text-sm text-gray-600">Issue resolved & ticket closed</p>
              </div>
            </div>
          </div>

          {/* Contact & Response Times */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                ⏰ Response Times
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">🔴 Urgent Issues</span>
                  <span className="font-medium text-red-600">2-4 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">🟡 High Priority</span>
                  <span className="font-medium text-orange-600">4-8 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">🟢 Normal</span>
                  <span className="font-medium text-green-600">24-48 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">🔵 Low Priority</span>
                  <span className="font-medium text-blue-600">2-3 days</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📞 Additional Support
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📧</span>
                  <div>
                    <p className="font-medium text-gray-900">Email Support</p>
                    <p className="text-sm text-gray-600">support@guidely.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">💬</span>
                  <div>
                    <p className="font-medium text-gray-900">Live Chat</p>
                    <p className="text-sm text-gray-600">Available on homepage</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🎫</span>
                  <div>
                    <p className="font-medium text-gray-900">Ticket System</p>
                    <p className="text-sm text-gray-600">Managed by admin panel</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
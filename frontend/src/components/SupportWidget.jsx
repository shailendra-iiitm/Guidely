import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import supportTickets from "../apiManger/supportTickets";
import useUserStore from "../store/user";

const SupportWidget = () => {
  const { user } = useUserStore();
  const [showSupport, setShowSupport] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    priority: 'medium',
    subject: '',
    message: ''
  });

  const toggleSupport = () => {
    setShowSupport(!showSupport);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in first
    if (!user) {
      alert('🔐 Please log in to create a support ticket.\n\n📝 This helps us:\n• Track your ticket status\n• Send you updates\n• Provide better support\n\n✉️ For immediate help, email us at guidely.iiit@gmail.com');
      return;
    }
    
    // Validate form
    if (!formData.category || !formData.subject || !formData.message) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create support ticket
      const ticketData = {
        subject: formData.subject,
        description: formData.message,
        category: formData.category,
        priority: formData.priority
      };
      
      const response = await supportTickets.createTicket(ticketData);
      
      if (response.success) {
        alert(`✅ Support ticket created successfully!\n\n🎫 Ticket ID: ${response.data.ticketId}\n\nYou can track your ticket status in the Support section of your dashboard.\n\n📧 You'll receive email updates on your ticket progress.`);
        
        // Clear form
        setFormData({
          category: '',
          priority: 'medium',
          subject: '',
          message: ''
        });
        
        // Close support form
        setShowSupport(false);
      }
      
    } catch (error) {
      console.error('Error creating support ticket:', error);
      
      const errorMessage = 'Failed to create support ticket. Please try again or email us directly at guidely.iiit@gmail.com';
      alert(`❌ ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Support Button */}
      <button
        onClick={toggleSupport}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-lg hover:from-purple-700 hover:to-blue-700 transition duration-300 transform hover:scale-110 z-50"
        aria-label="Contact Support"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
        </svg>
      </button>

      {/* Support Modal */}
      {showSupport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Need Support?</h2>
                <button
                  onClick={() => setShowSupport(false)}
                  className="text-gray-400 hover:text-gray-600 transition duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              {!user ? (
                <div className="text-center py-8">
                  <div className="mb-6">
                    <svg className="w-16 h-16 text-purple-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Login Required</h3>
                    <p className="text-gray-600 mb-6">
                      Please log in to create a support ticket. This helps us provide better support and track your requests.
                    </p>
                    <div className="space-y-3">
                      <NavLink to="/signin" className="block w-full max-w-xs mx-auto">
                        <button 
                          className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition duration-300"
                          onClick={() => setShowSupport(false)}
                        >
                          Login to Continue
                        </button>
                      </NavLink>
                      <p className="text-sm text-gray-500">
                        Don't have an account? <NavLink to="/signup/learner" className="text-purple-600 hover:text-purple-700 underline" onClick={() => setShowSupport(false)}>Sign up here</NavLink>
                      </p>
                    </div>
                  </div>
                  <div className="border-t pt-6">
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Need immediate help?</strong>
                    </p>
                    <p className="text-sm text-gray-600">
                      Email us directly at{" "}
                      <a href="mailto:guidely.iiit@gmail.com" className="text-blue-600 hover:text-blue-500 underline">
                        guidely.iiit@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitTicket} className="space-y-6">
                  <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-800">
                      <strong>👋 Hi {user.name || user.username}!</strong> Creating a support ticket as a logged-in user.
                    </p>
                    {user.role === 'admin' && (
                      <p className="text-sm text-blue-600 mt-2">
                        💼 You can also manage tickets in your <NavLink to="/admin/dashboard" className="underline hover:text-blue-800" onClick={() => setShowSupport(false)}>Admin Dashboard</NavLink>
                      </p>
                    )}
                    {(user.role === 'learner' || user.role === 'guide') && (
                      <p className="text-sm text-blue-600 mt-2">
                        📋 Track your tickets in your <NavLink to="/dashboard" className="underline hover:text-blue-800" onClick={() => setShowSupport(false)}>Dashboard</NavLink>
                      </p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                        Support Category *
                      </label>
                      <select
                        id="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select category</option>
                        <option value="general">General Inquiry</option>
                        <option value="technical">Technical Issue</option>
                        <option value="billing">Billing & Payments</option>
                        <option value="booking">Booking & Scheduling</option>
                        <option value="account">Account & Profile</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                        Priority Level
                      </label>
                      <select
                        id="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Brief description of your issue or question"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Please provide detailed information about your issue, question, or request..."
                      required
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowSupport(false)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-6 py-3 font-semibold rounded-lg transition duration-300 ${
                        isSubmitting 
                          ? 'bg-gray-400 cursor-not-allowed text-white' 
                          : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                      }`}
                    >
                      {isSubmitting ? 'Creating Ticket...' : 'Create Support Ticket'}
                    </button>
                  </div>
                </form>
              )}

              {/* Support Information */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-2">🎫 About Support Tickets</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Get a unique ticket ID for tracking</li>
                    <li>• Receive email updates on progress</li>
                    <li>• Track status in your dashboard</li>
                    <li>• Get responses from our support team</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SupportWidget;
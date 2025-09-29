import React, { useState, useEffect, useCallback } from "react";
import adminManagement from "../../apiManger/adminManagement";
import toast from "react-hot-toast";

const GuideVerification = () => {
  const [guides, setGuides] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filters, setFilters] = useState({
    status: 'pending',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({});

  const fetchGuides = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await adminManagement.getAllUsers({
        ...filters,
        role: 'guide'
      });
      setGuides(response.data.users.filter(user => 
        user.guideVerification && user.guideVerification.status === filters.status
      ));
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching guides:", error);
      toast.error("Failed to load guides");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchGuides();
  }, [fetchGuides]);

  const openGuideModal = async (guide) => {
    try {
      const response = await adminManagement.getUserById(guide._id);
      setSelectedGuide(response.data.user);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching guide details:", error);
      toast.error("Failed to load guide details");
    }
  };

  const closeGuideModal = () => {
    setSelectedGuide(null);
    setIsModalOpen(false);
  };

  const handleVerificationAction = async (guideId, status, comments = '') => {
    try {
      setIsProcessing(true);
      await adminManagement.updateUserStatus(guideId, {
        'guideVerification.status': status,
        'guideVerification.reviewedAt': new Date(),
        'guideVerification.reviewComments': comments
      });
      
      toast.success(`Guide ${status} successfully`);
      fetchGuides();
      closeGuideModal();
    } catch (error) {
      console.error("Error updating verification status:", error);
      toast.error("Failed to update verification status");
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Guide Verification
            </h1>
            <p className="text-gray-600">
              Review and verify guide applications and documents
            </p>
          </div>
          <button
            onClick={fetchGuides}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {['pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => handleFilterChange('status', status)}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                filters.status === status
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {guides.length > 0 && (
                <span className="ml-2 px-2 py-1 text-xs bg-gray-200 rounded-full">
                  {guides.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Guides List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : guides.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {filters.status} guides
            </h3>
            <p className="text-gray-500">
              There are no guides with {filters.status} status at the moment.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {guides.map((guide) => (
              <div key={guide._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {guide.name?.charAt(0)?.toUpperCase() || "G"}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {guide.name}
                      </h3>
                      <p className="text-sm text-gray-600">{guide.email}</p>
                      <p className="text-xs text-gray-500">@{guide.username}</p>
                      {guide.guideVerification?.submittedAt && (
                        <p className="text-xs text-gray-400 mt-1">
                          Submitted: {new Date(guide.guideVerification.submittedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(guide.guideVerification?.status)}`}>
                      {guide.guideVerification?.status || 'pending'}
                    </span>
                    <button
                      onClick={() => openGuideModal(guide)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Review
                    </button>
                  </div>
                </div>
                
                {guide.guideVerification?.reviewComments && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Review Comments:</strong> {guide.guideVerification.reviewComments}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

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
      </div>

      {/* Guide Details Modal */}
      {isModalOpen && selectedGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Guide Verification Details</h3>
              <button
                onClick={closeGuideModal}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Guide Information */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {selectedGuide.name?.charAt(0)?.toUpperCase() || "G"}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">{selectedGuide.name}</h4>
                    <p className="text-gray-600">{selectedGuide.email}</p>
                    <p className="text-sm text-gray-500">@{selectedGuide.username}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Current Status</label>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedGuide.guideVerification?.status)}`}>
                      {selectedGuide.guideVerification?.status || 'pending'}
                    </span>
                  </div>

                  {selectedGuide.guideVerification?.submittedAt && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Submitted At</label>
                      <p className="text-sm text-gray-900">
                        {new Date(selectedGuide.guideVerification.submittedAt).toLocaleString()}
                      </p>
                    </div>
                  )}

                  {selectedGuide.guideVerification?.reviewedAt && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Reviewed At</label>
                      <p className="text-sm text-gray-900">
                        {new Date(selectedGuide.guideVerification.reviewedAt).toLocaleString()}
                      </p>
                    </div>
                  )}

                  {selectedGuide.guideVerification?.reviewComments && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Previous Comments</label>
                      <p className="text-sm text-gray-900 p-3 bg-gray-50 rounded-lg">
                        {selectedGuide.guideVerification.reviewComments}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Documents */}
              <div className="space-y-4">
                <h5 className="font-medium text-gray-800">Submitted Documents</h5>
                {selectedGuide.guideVerification?.documents && selectedGuide.guideVerification.documents.length > 0 ? (
                  <div className="space-y-3">
                    {selectedGuide.guideVerification.documents.map((doc, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{doc.type || 'Document'}</p>
                            <p className="text-xs text-gray-500">{doc.filename || 'Unknown file'}</p>
                          </div>
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                          >
                            View
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No documents submitted</p>
                )}
              </div>
            </div>

            {/* Actions */}
            {selectedGuide.guideVerification?.status === 'pending' && (
              <div className="mt-8 pt-6 border-t">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Review Comments (Optional)
                    </label>
                    <textarea
                      id="reviewComments"
                      rows={3}
                      placeholder="Add comments about your decision..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        const comments = document.getElementById('reviewComments').value;
                        handleVerificationAction(selectedGuide._id, 'rejected', comments);
                      }}
                      disabled={isProcessing}
                      className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
                    >
                      {isProcessing ? 'Processing...' : '❌ Reject'}
                    </button>
                    <button
                      onClick={() => {
                        const comments = document.getElementById('reviewComments').value;
                        handleVerificationAction(selectedGuide._id, 'approved', comments);
                      }}
                      disabled={isProcessing}
                      className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
                    >
                      {isProcessing ? 'Processing...' : '✅ Approve'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t flex justify-end">
              <button
                onClick={closeGuideModal}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuideVerification;
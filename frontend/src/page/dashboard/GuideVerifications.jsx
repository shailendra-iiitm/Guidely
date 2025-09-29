import React, { useState, useEffect } from "react";
import guideVerification from "../../apiManger/guideVerification";
import toast from "react-hot-toast";

const GuideVerifications = () => {
  const [pendingGuides, setPendingGuides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [reviewData, setReviewData] = useState({ status: "", comments: "" });
  const [isReviewing, setIsReviewing] = useState(false);

  useEffect(() => {
    fetchPendingVerifications();
  }, []);

  const fetchPendingVerifications = async () => {
    try {
      setIsLoading(true);
      const response = await guideVerification.getPendingVerifications();
      setPendingGuides(response.data.pendingGuides || []);
    } catch (error) {
      console.error("Error fetching pending verifications:", error);
      toast.error("Failed to load pending verifications");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReview = async (guideId) => {
    if (!reviewData.status) {
      toast.error("Please select approve or reject");
      return;
    }

    try {
      setIsReviewing(true);
      await guideVerification.reviewVerification(guideId, reviewData);
      toast.success(`Guide verification ${reviewData.status} successfully!`);
      
      // Remove the reviewed guide from the list
      setPendingGuides(prev => prev.filter(guide => guide.id !== guideId));
      setSelectedGuide(null);
      setReviewData({ status: "", comments: "" });
    } catch (error) {
      console.error("Error reviewing verification:", error);
      toast.error("Failed to review verification");
    } finally {
      setIsReviewing(false);
    }
  };

  const openReviewModal = (guide) => {
    setSelectedGuide(guide);
    setReviewData({ status: "", comments: "" });
  };

  const closeReviewModal = () => {
    setSelectedGuide(null);
    setReviewData({ status: "", comments: "" });
  };

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
              Guide Verifications
            </h1>
            <p className="text-gray-600">
              Review and approve guide verification requests
            </p>
          </div>
          <button
            onClick={fetchPendingVerifications}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Pending Verifications */}
      {pendingGuides.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No Pending Verifications
          </h3>
          <p className="text-gray-600">
            All guide verification requests have been processed.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {pendingGuides.map((guide) => (
            <div key={guide.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {guide.name}
                  </h3>
                  <p className="text-gray-600">{guide.email}</p>
                  <span className="inline-block mt-2 px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full">
                    ⏳ Pending Review
                  </span>
                </div>
                <button
                  onClick={() => openReviewModal(guide)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Review
                </button>
              </div>

              {/* Guide Info */}
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Profile Information:</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>Title:</strong> {guide.profile?.title || "Not provided"}</p>
                    <p><strong>Location:</strong> {guide.profile?.location || "Not provided"}</p>
                    <p><strong>Tags:</strong> {guide.profile?.tags?.join(", ") || "None"}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Verification Status:</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>Status:</strong> {guide.guideVerification?.status || "Pending"}</p>
                    <p><strong>Submitted:</strong> {
                      guide.guideVerification?.submittedAt 
                        ? new Date(guide.guideVerification.submittedAt).toLocaleDateString()
                        : "Not submitted"
                    }</p>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="mt-4">
                <h4 className="font-medium text-gray-700 mb-2">Submitted Documents:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['identity', 'qualification', 'experience'].map((docType) => {
                    const doc = guide.guideVerification?.documents?.[docType];
                    return (
                      <div key={docType} className="border rounded-lg p-4">
                        <h5 className="font-medium text-gray-600 mb-2 capitalize">
                          {docType} Document
                        </h5>
                        {doc?.url ? (
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700 text-sm"
                          >
                            📄 View Document
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm">Not uploaded</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {selectedGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Review Verification</h3>
              <button
                onClick={closeReviewModal}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <p className="text-gray-600 mb-2">
                <strong>Guide:</strong> {selectedGuide.name}
              </p>
              <p className="text-gray-600">
                <strong>Email:</strong> {selectedGuide.email}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Decision
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="approved"
                    checked={reviewData.status === "approved"}
                    onChange={(e) => setReviewData(prev => ({ ...prev, status: e.target.value }))}
                    className="mr-2"
                  />
                  <span className="text-green-600">✅ Approve</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="rejected"
                    checked={reviewData.status === "rejected"}
                    onChange={(e) => setReviewData(prev => ({ ...prev, status: e.target.value }))}
                    className="mr-2"
                  />
                  <span className="text-red-600">❌ Reject</span>
                </label>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comments (Optional)
              </label>
              <textarea
                value={reviewData.comments}
                onChange={(e) => setReviewData(prev => ({ ...prev, comments: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add any comments for the guide..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={closeReviewModal}
                disabled={isReviewing}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReview(selectedGuide.id)}
                disabled={isReviewing || !reviewData.status}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {isReviewing ? "Processing..." : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuideVerifications;
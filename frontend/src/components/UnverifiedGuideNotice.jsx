import React from "react";

const UnverifiedGuideNotice = ({ user }) => {
  if (user?.role !== 'guide' || user?.verified) {
    return null;
  }

  const getVerificationStatus = () => {
    const status = user?.guideVerification?.status || 'pending';
    
    switch (status) {
      case 'pending':
        return {
          title: "Verification Under Review",
          message: "Your guide verification is currently being reviewed by our admin team.",
          color: "bg-yellow-50 border-yellow-200",
          iconColor: "text-yellow-600",
          icon: "⏳"
        };
      case 'rejected':
        return {
          title: "Verification Rejected",
          message: user?.guideVerification?.reviewComments || "Your verification was rejected. Please contact support for details.",
          color: "bg-red-50 border-red-200",
          iconColor: "text-red-600",
          icon: "❌"
        };
      default:
        return {
          title: "Verification Required",
          message: "Please complete your guide verification to start guiding.",
          color: "bg-blue-50 border-blue-200",
          iconColor: "text-blue-600",
          icon: "📋"
        };
    }
  };

  const statusInfo = getVerificationStatus();

  return (
    <div className={`border rounded-lg p-6 mb-6 ${statusInfo.color}`}>
      <div className="flex items-start space-x-4">
        <div className={`text-3xl ${statusInfo.iconColor}`}>
          {statusInfo.icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {statusInfo.title}
          </h3>
          <p className="text-gray-700 mb-4">
            {statusInfo.message}
          </p>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">
              📞 Need Help? Contact Support
            </h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-green-600">📱</span>
                <div>
                  <p className="font-medium text-gray-900">Phone Support</p>
                  <p className="text-sm text-gray-600">
                    <a href="tel:7651967439" className="text-blue-600 hover:underline">
                      7651967439
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-blue-600">📧</span>
                <div>
                  <p className="font-medium text-gray-900">Email Support</p>
                  <p className="text-sm text-gray-600">
                    <a href="mailto:guidely.iiit@gmail.com" className="text-blue-600 hover:underline">
                      guidely.iiit@gmail.com
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-purple-600">🎫</span>
                <div>
                  <p className="font-medium text-gray-900">Support Tickets</p>
                  <p className="text-sm text-gray-600">
                    <a href="/support" className="text-blue-600 hover:underline">
                      Submit a support ticket
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {user?.guideVerification?.status === 'pending' && (
            <div className="mt-4 p-3 bg-blue-100 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Next Steps:</strong> Our admin team typically reviews verification requests within 24-48 hours. 
                You'll receive an email notification once your verification is complete.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnverifiedGuideNotice;
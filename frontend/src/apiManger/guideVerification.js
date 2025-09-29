import AxiosInstances from ".";

const getVerificationStatus = () => {
  return AxiosInstances.get("/guide-verification/status");
};

const uploadDocuments = (formData) => {
  return AxiosInstances.post("/guide-verification/upload-documents", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const getPendingVerifications = () => {
  return AxiosInstances.get("/guide-verification/pending");
};

const reviewVerification = (guideId, data) => {
  return AxiosInstances.patch(`/guide-verification/review/${guideId}`, data);
};

const getVerifiedGuides = (params = {}) => {
  return AxiosInstances.get("/guide-verification/verified-guides", { params });
};

export default { 
  getVerificationStatus,
  uploadDocuments,
  getPendingVerifications,
  reviewVerification,
  getVerifiedGuides
};
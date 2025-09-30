import React, { useState } from "react";
import toast from "react-hot-toast";

const GuideDocumentUpload = ({ onDocumentsUploaded, isLoading = false }) => {
  const [uploadMethod, setUploadMethod] = useState('consolidated'); // 'consolidated' or 'individual'
  const [documents, setDocuments] = useState({
    consolidatedDocument: null,
    identity: null,
    qualification: null,
    experience: null
  });
  const [uploadProgress, setUploadProgress] = useState({});

  const uploadToCloudinary = async (file, docType) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'guidely_docs'); // You'll need to create this preset in Cloudinary
    formData.append('folder', `guidely/verification/${docType}`);

    try {
      setUploadProgress(prev => ({ ...prev, [docType]: 0 }));
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/upload`, // Replace with your cloud name
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setUploadProgress(prev => ({ ...prev, [docType]: 100 }));
      
      return {
        url: data.secure_url,
        publicId: data.public_id,
        uploadedAt: new Date()
      };
    } catch (error) {
      console.error(`Error uploading ${docType}:`, error);
      setUploadProgress(prev => ({ ...prev, [docType]: -1 }));
      throw error;
    }
  };

  const handleFileChange = (docType, file) => {
    if (file && file.type === 'application/pdf') {
      setDocuments(prev => ({ ...prev, [docType]: file }));
      setUploadProgress(prev => ({ ...prev, [docType]: null }));
    } else {
      toast.error('Please select a PDF file');
    }
  };

  const handleUpload = async () => {
    try {
      const uploadedDocs = {};
      
      if (uploadMethod === 'consolidated' && documents.consolidatedDocument) {
        uploadedDocs.consolidatedDocument = await uploadToCloudinary(
          documents.consolidatedDocument, 
          'consolidated'
        );
      } else if (uploadMethod === 'individual') {
        for (const [docType, file] of Object.entries(documents)) {
          if (file && docType !== 'consolidatedDocument') {
            uploadedDocs[docType] = await uploadToCloudinary(file, docType);
          }
        }
      }

      if (Object.keys(uploadedDocs).length === 0) {
        toast.error('Please select at least one document to upload');
        return;
      }

      await onDocumentsUploaded(uploadedDocs);
      toast.success('Documents uploaded successfully!');
      
      // Reset form
      setDocuments({
        consolidatedDocument: null,
        identity: null,
        qualification: null,
        experience: null
      });
      setUploadProgress({});
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload documents. Please try again.');
    }
  };

  const getFileIcon = (progress) => {
    if (progress === null) return '📄';
    if (progress === -1) return '❌';
    if (progress === 100) return '✅';
    return '⏳';
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          📋 Upload Verification Documents
        </h3>
        <p className="text-sm text-gray-600">
          Upload your documents for guide verification. All documents must be in PDF format.
        </p>
      </div>

      {/* Upload Method Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Choose Upload Method:
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
              uploadMethod === 'consolidated' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setUploadMethod('consolidated')}
          >
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                name="uploadMethod"
                value="consolidated"
                checked={uploadMethod === 'consolidated'}
                onChange={(e) => setUploadMethod(e.target.value)}
                className="text-blue-600"
              />
              <div>
                <h4 className="font-medium text-gray-900">📄 Consolidated PDF</h4>
                <p className="text-sm text-gray-600">
                  All documents in one PDF file (Recommended)
                </p>
              </div>
            </div>
          </div>
          
          <div 
            className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
              uploadMethod === 'individual' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setUploadMethod('individual')}
          >
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                name="uploadMethod"
                value="individual"
                checked={uploadMethod === 'individual'}
                onChange={(e) => setUploadMethod(e.target.value)}
                className="text-blue-600"
              />
              <div>
                <h4 className="font-medium text-gray-900">📁 Individual Files</h4>
                <p className="text-sm text-gray-600">
                  Upload each document separately
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* File Upload Areas */}
      {uploadMethod === 'consolidated' ? (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📄 Consolidated Document (PDF)
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Include: Aadhaar/ID Proof, Educational Qualifications, Experience Certificates, etc.
          </p>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileChange('consolidatedDocument', e.target.files[0])}
              className="hidden"
              id="consolidated-upload"
            />
            <label htmlFor="consolidated-upload" className="cursor-pointer">
              <div className="text-4xl mb-2">
                {getFileIcon(uploadProgress.consolidatedDocument)}
              </div>
              <p className="text-sm text-gray-600">
                {documents.consolidatedDocument ? documents.consolidatedDocument.name : 'Click to select PDF file'}
              </p>
              {uploadProgress.consolidatedDocument !== null && uploadProgress.consolidatedDocument !== -1 && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${uploadProgress.consolidatedDocument}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </label>
          </div>
        </div>
      ) : (
        <div className="space-y-4 mb-6">
          {[
            { key: 'identity', label: '🆔 Identity Proof (Aadhaar/Passport/Driver\'s License)', required: true },
            { key: 'qualification', label: '🎓 Educational Qualification Certificates', required: true },
            { key: 'experience', label: '💼 Experience Certificates (if applicable)', required: false }
          ].map(({ key, label, required }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {label} {required && <span className="text-red-500">*</span>}
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(key, e.target.files[0])}
                  className="hidden"
                  id={`${key}-upload`}
                />
                <label htmlFor={`${key}-upload`} className="cursor-pointer">
                  <div className="text-2xl mb-1">
                    {getFileIcon(uploadProgress[key])}
                  </div>
                  <p className="text-sm text-gray-600">
                    {documents[key] ? documents[key].name : 'Click to select PDF'}
                  </p>
                  {uploadProgress[key] !== null && uploadProgress[key] !== -1 && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div 
                          className="bg-blue-600 h-1 rounded-full transition-all"
                          style={{ width: `${uploadProgress[key]}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      <div className="flex justify-end">
        <button
          onClick={handleUpload}
          disabled={isLoading || Object.values(uploadProgress).some(p => p !== null && p !== 100 && p !== -1)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Uploading...' : '📤 Upload Documents'}
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-medium text-yellow-900 mb-2">📝 Document Guidelines:</h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• All documents must be in PDF format</li>
          <li>• Documents should be clear and readable</li>
          <li>• Maximum file size: 10MB per document</li>
          <li>• Consolidated PDF is recommended for faster processing</li>
          <li>• Contact 7651967439 for any upload issues</li>
        </ul>
      </div>
    </div>
  );
};

export default GuideDocumentUpload;
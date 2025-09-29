# Guidely Backend - New Features Implementation

## Overview
This document outlines the implementation of three major features added to the Guidely platform:

1. **Admin User Management** - Single admin user with system management capabilities
2. **Password Reset with OTP** - Secure password recovery via email OTP
3. **Guide Verification System** - Document-based verification for guides with Cloudinary integration

## 1. Admin User Management

### Features
- Single admin user system (only one admin allowed)
- Admin dashboard with system statistics
- Admin-only access to guide verification reviews
- Secure admin initialization

### Implementation Details

#### Admin User Model
- Added `admin` role to the user model enum
- Admin users have elevated privileges for system management

#### Admin Routes
```
POST /v1/admin/init-admin - Initialize admin user (one-time setup)
GET /v1/admin/dashboard - Get system statistics (admin only)
```

#### Admin Credentials (Default)
- **Email**: `admin@guidely.com`
- **Password**: `Admin@123`
- **⚠️ Important**: Change password after first login

#### Initialization
Run the following command to create the admin user:
```bash
npm run init-admin
```

## 2. Password Reset with OTP

### Features
- Secure 6-digit OTP generation
- Email-based OTP delivery with beautiful HTML template
- OTP expiry (10 minutes)
- One-time use OTP validation
- Automatic cleanup of expired/used OTPs

### Implementation Details

#### New Models
- **OTP Model**: Stores OTPs with automatic expiry
  - Supports multiple OTP types (password_reset, email_verification)
  - Auto-expires after 10 minutes
  - Prevents OTP reuse

#### Password Reset Flow
1. **Request Reset**: User provides email
2. **Generate OTP**: System generates 6-digit OTP
3. **Send Email**: OTP sent via email with template
4. **Verify OTP**: User enters OTP for verification
5. **Reset Password**: User sets new password with OTP validation

#### API Endpoints
```
POST /v1/auth/forgot-password
Body: { "email": "user@example.com" }

POST /v1/auth/verify-reset-otp  
Body: { "email": "user@example.com", "otp": "123456" }

POST /v1/auth/reset-password
Body: { "email": "user@example.com", "otp": "123456", "newPassword": "newPass123" }
```

#### Email Template
- Professional HTML email template with Guidely branding
- Responsive design
- Security warnings and instructions
- Located at: `backend/template/password-reset-otp.ejs`

## 3. Guide Verification System

### Features
- Document upload via Cloudinary
- Three document types: Identity, Qualification, Experience
- Admin review system (approve/reject)
- Verification status tracking
- Only verified guides visible to users
- Secure file upload with validation

### Implementation Details

#### Enhanced User Model
Added `guideVerification` object with:
- **Status**: pending, approved, rejected
- **Documents**: Identity, qualification, experience certificates
- **Review tracking**: Admin review details and timestamps
- **Comments**: Admin feedback on verification

#### Document Storage
- **Cloudinary Integration**: Secure cloud-based file storage
- **Organized Folders**: `guidely/verification/{userId}/`
- **File Types**: Auto-detection (images, PDFs, etc.)
- **Security**: Public IDs for easy management

#### Verification Workflow
1. **Guide Registration**: Guide creates account
2. **Document Upload**: Guide uploads required documents
3. **Admin Review**: Admin reviews and approves/rejects
4. **Visibility**: Only approved guides appear in searches
5. **Status Tracking**: Guides can check verification status

#### API Endpoints

##### For Guides:
```
POST /v1/guide-verification/upload-documents
- Upload identity, qualification, experience documents
- Requires authentication + guide role
- Uses multipart/form-data

GET /v1/guide-verification/status
- Check verification status
- Requires authentication + guide role
```

##### For Admins:
```
GET /v1/guide-verification/pending
- Get all pending verifications
- Requires authentication + admin role

PATCH /v1/guide-verification/review/:guideId
- Approve or reject verification
- Body: { "status": "approved|rejected", "comments": "Optional feedback" }
- Requires authentication + admin role
```

##### Public:
```
GET /v1/guide-verification/verified-guides
- Get all verified guides
- Public access
- Supports filtering by tags and location
```

#### File Upload Configuration
```javascript
// Supported file types: images, PDFs, documents
// Max file size: Configured in upload middleware
// Upload fields:
- identity: Identity document (passport, license, etc.)
- qualification: Educational certificates
- experience: Work experience certificates
```

## Database Changes

### User Model Updates
```javascript
// New fields added to user schema:
role: ["guide", "learner", "admin"] // Added admin role

guideVerification: {
  status: "pending|approved|rejected",
  documents: {
    identity: { url, publicId, uploadedAt },
    qualification: { url, publicId, uploadedAt },
    experience: { url, publicId, uploadedAt }
  },
  submittedAt: Date,
  reviewedAt: Date,
  reviewedBy: ObjectId, // Reference to admin user
  reviewComments: String
}

// Password reset fields:
resetPasswordOtp: String,
resetPasswordExpiry: Date
```

### New Models
```javascript
// OTP Model for password reset
{
  email: String,
  otp: String,
  type: "password_reset|email_verification",
  expiresAt: Date, // Auto-expires in 10 minutes
  used: Boolean
}
```

## Security Considerations

### Admin Security
- Only one admin user allowed in the system
- Admin routes protected with role-based middleware
- Admin initialization requires direct server access

### OTP Security
- 6-digit random OTP generation
- 10-minute expiry time
- One-time use validation
- Automatic cleanup of expired OTPs
- Rate limiting recommended for production

### File Upload Security
- Cloudinary integration with secure API keys
- File type validation
- Organized folder structure
- Public ID tracking for file management

### Password Security
- Bcrypt hashing for all passwords
- Password complexity validation
- Secure token-based authentication

## Environment Variables

Add the following to your `.env` file:

```env
# Cloudinary Configuration (already configured)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (for OTP)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USERNAME=your_email
SMTP_PASSWORD=your_email_password
EMAIL_FROM=noreply@guidely.com
```

## Usage Examples

### Admin Initialization
```bash
# Run once during setup
npm run init-admin
```

### Password Reset (Frontend Integration)
```javascript
// Step 1: Request OTP
const response = await fetch('/v1/auth/forgot-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com' })
});

// Step 2: Verify OTP
const verifyResponse = await fetch('/v1/auth/verify-reset-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com', otp: '123456' })
});

// Step 3: Reset Password
const resetResponse = await fetch('/v1/auth/reset-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    email: 'user@example.com', 
    otp: '123456', 
    newPassword: 'newPassword123' 
  })
});
```

### Guide Document Upload
```javascript
// Upload documents
const formData = new FormData();
formData.append('identity', identityFile);
formData.append('qualification', qualificationFile);
formData.append('experience', experienceFile);

const response = await fetch('/v1/guide-verification/upload-documents', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});
```

### Admin Guide Review
```javascript
// Review guide verification
const response = await fetch(`/v1/guide-verification/review/${guideId}`, {
  method: 'PATCH',
  headers: { 
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    status: 'approved',
    comments: 'All documents verified successfully'
  })
});
```

## Frontend Integration Requirements

### 1. Password Reset Pages
- Forgot password form (email input)
- OTP verification form (6-digit input)
- New password form (password + confirm)

### 2. Guide Verification Pages
- Document upload form (3 file inputs)
- Verification status display
- Upload progress indicators

### 3. Admin Panel
- Dashboard with system stats
- Pending verifications list
- Verification review interface
- Guide document viewer

### 4. Updated Guide Display
- Only show verified guides
- Add verification badges
- Filter by verification status

## Testing

### Test Admin Login
1. Initialize admin: `npm run init-admin`
2. Login with: `admin@guidely.com` / `Admin@123`
3. Access admin routes with JWT token

### Test Password Reset
1. Request OTP for any existing user
2. Check email for OTP
3. Verify OTP and reset password
4. Login with new password

### Test Guide Verification
1. Register as guide
2. Upload required documents
3. Login as admin and review
4. Check guide visibility in public endpoints

## Performance Considerations

### Database Indexes
- Email index for fast user lookup
- OTP expiry index for automatic cleanup
- Guide verification status index

### File Storage
- Cloudinary CDN for fast file delivery
- Organized folder structure for easy management
- Automatic image optimization

### Caching Recommendations
- Cache verified guides list
- Cache admin dashboard stats
- Cache OTP validation results (short-term)

## Monitoring and Logging

All major operations include detailed logging:
- Admin operations
- Password reset attempts
- Document uploads
- Verification reviews
- Authentication failures

Monitor these logs for security and performance insights.

## Production Deployment Notes

1. **Environment Variables**: Ensure all required env vars are set
2. **Cloudinary Setup**: Configure production Cloudinary account
3. **Email Service**: Set up production SMTP service
4. **Security**: Enable HTTPS for all operations
5. **Rate Limiting**: Implement rate limiting for auth endpoints
6. **Monitoring**: Set up logging and monitoring for admin operations

## Troubleshooting

### Common Issues

1. **Admin Creation Fails**
   - Check database connection
   - Verify no existing admin user
   - Check password requirements

2. **OTP Not Received**
   - Verify SMTP configuration
   - Check spam folder
   - Verify email service status

3. **File Upload Fails**
   - Check Cloudinary credentials
   - Verify file size limits
   - Check file type restrictions

4. **Guide Not Visible**
   - Verify guide is approved
   - Check verification status
   - Confirm guide queries include verified filter

---

## Summary

These three features significantly enhance the Guidely platform:

1. **Admin System**: Provides centralized management and oversight
2. **Password Recovery**: Improves user experience and security
3. **Guide Verification**: Ensures quality and trust in the platform

All features are production-ready with proper security, validation, and error handling. The implementation follows RESTful principles and maintains consistency with the existing codebase.
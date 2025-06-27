# Guidely

Guidely is a modern platform connecting Guides and Learners for seamless knowledge sharing, guidance, and bookings. The platform enables experienced professionals to offer their expertise while learners can easily discover, book, and learn from qualified guides.

## 🚀 Project Status

**Near Completion** - All core features implemented and tested. Ready for production deployment.

## 📁 Project Structure

- `/backend` — Express.js REST API server with MongoDB
- `/frontend` — React SPA with Vite and Tailwind CSS
- `/docs` — Project documentation and updates


## 🛠 Tech Stack

### Backend
- **Node.js & Express.js** — RESTful API server
- **MongoDB** — NoSQL database with Mongoose ODM
- **JWT Authentication** — Secure user sessions
- **Cloudinary** — Image upload and management
- **Razorpay** — Payment processing
- **Zoom API** — Video call integration
- **Nodemailer** — Email notifications

### Frontend
- **React 19** — Modern UI framework
- **Vite** — Fast build tool and dev server
- **Tailwind CSS** — Utility-first CSS framework
- **Ant Design** — Professional UI components
- **React Router** — Client-side routing
- **Zustand** — Lightweight state management
- **Axios** — HTTP client for API calls

## ✨ Features

### 🔐 Authentication & User Management
- Secure user registration and login
- JWT-based authentication
- Role-based access (Guide/Learner)
- Profile management with image uploads
- Password reset functionality

### 👨‍🏫 Guide Features
- Complete guide profile setup
- Service offerings management
- Availability scheduling
- Real-time booking notifications
- Earnings and payment tracking
- Learning progress tracking for students

### 👨‍🎓 Learner Features
- Browse and search guides by expertise
- View detailed guide profiles and services
- Book sessions with preferred guides
- Secure payment processing
- Session history and progress tracking
- Rating and review system

### 📅 Booking System
- Real-time availability checking
- Flexible scheduling options
- Automatic booking confirmations
- Status tracking (pending, confirmed, completed, cancelled)
- Email notifications for all booking updates
- Zoom integration for virtual sessions

### 💳 Payment Integration
- Razorpay payment processing
- Secure transaction handling
- Automatic payment confirmations
- Webhook support for real-time updates
- Payment history and receipts

### 📧 Communication
- Automated email notifications
- Booking confirmations and reminders
- Status update notifications
- Welcome emails for new users

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB database
- Cloudinary account (for image uploads)
- Razorpay account (for payments)
- Zoom API credentials (for video calls)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Guidely
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Configure your environment variables
   npm start
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Environment Configuration

Create `.env` files in both backend and frontend directories with the required environment variables. Check the documentation for detailed setup instructions.

## 📱 API Documentation

The API includes comprehensive endpoints for:
- User authentication and management
- Guide and service operations
- Booking and availability management
- Payment processing
- File uploads and media handling

Detailed API documentation is available in `/backend/BOOKING_API_DOCS.md`.

## 🎯 Current Status

- ✅ User authentication and authorization
- ✅ Guide profile and service management
- ✅ Booking system with real-time updates
- ✅ Payment integration with Razorpay
- ✅ Email notification system
- ✅ File upload and media management
- ✅ Availability scheduling
- ✅ Learning progress tracking
- ✅ Rating and review system
- ✅ Responsive frontend UI
- ✅ API testing and validation

## 🚀 Deployment Ready

The application is production-ready with:
- Comprehensive error handling
- Input validation and sanitization
- Security middleware implementation
- Database optimization
- Testing utilities and scripts
- Documentation and guides

## 📞 Support

For questions or support, please refer to the documentation in the `/docs` folder or contact the development team.

---

*Last updated: June 28, 2025*

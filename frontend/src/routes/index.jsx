import SignIn from "../page/signin.jsx";
import SignUp from "../page/signup.jsx";
import Home from "../page/index.jsx"
import PageNotFound from "../page/pageNotFound.jsx";
import AllGuides from "../page/allGuides.jsx";
import GuideDetails from "../page/guideDetails.jsx";
import Booking from "../page/booking.jsx";
import SuccessPage from "../page/successPage.jsx";
import BookingPage from "../page/bookingPage.jsx";
import DashboardSelector from "../page/dashboard/DashboardSelector.jsx";
import Services from "../page/dashboard/services.jsx";
import Profile from "../page/dashboard/profile.jsx";
import Schedule from "../page/dashboard/schedule.jsx";
import Payment from "../page/dashboard/payment.jsx";
import Bookings from "../page/Bookings.jsx";
import FindGuides from "../page/dashboard/FindGuides.jsx";
import LearningProgress from "../page/dashboard/LearningProgress.jsx";
import LearnerDashboardHome from "../page/dashboard/LearnerDashboardHome.jsx";
import GuideDashboardHome from "../page/dashboard/GuideDashboardHome.jsx";
import DashboardHome from "../page/dashboard/DashboardHome.jsx";
import ErrorBoundary from "../components/ErrorBoundary.jsx";
import ForgotPassword from "../page/forgotPassword.jsx";
import AdminDashboardHome from "../page/dashboard/AdminDashboardHome.jsx";
import GuideVerifications from "../page/dashboard/GuideVerifications.jsx";
import UserManagement from "../page/dashboard/UserManagement.jsx";
import GuideVerification from "../page/dashboard/GuideVerification.jsx";
import DetailedStats from "../page/dashboard/DetailedStats.jsx";

const routes = [
  {
    path: "/",
    element: <Home />,
    isProtected: false,
  },
  {
    path: "/signup/:role",
    element: <SignUp />,
    isProtected: false,
  },
  {
    path: "/signin",
    element: <SignIn />,
    isProtected: false,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    isProtected: false,
  },

  {
    path: "/guides",
    element: <AllGuides />,
    isProtected: false,
  },
  {
    path: "/guide/:username",
    element: <GuideDetails />,
    isProtected: false,
  },
  {
    path: "/guide/:username/:id",
    element: (
      <ErrorBoundary>
        <Booking />
      </ErrorBoundary>
    ),
    isProtected: true,
  },
  {
    path: "/success",
    element: <SuccessPage />,
    isProtected: true,
  },
  {
    path: "/user-bookings",
    element: <BookingPage />,
    isProtected: true,
  },
  {
    path: "*",
    element: <PageNotFound />,
    isProtected: false,
  },
   {
    path: "/dashboard",
    element: <DashboardHome />,
    isProtected: true,
  },
  {
    path: "/dashboard/services",
    element: (
      <DashboardSelector>
        <Services />
      </DashboardSelector>
    ),
    isProtected: true,
  },
  {
    path: "/dashboard/profile",
    element: (
      <DashboardSelector>
        <Profile />
      </DashboardSelector>
    ),
    isProtected: true,
  },
  {
    path: "/dashboard/schedule",
    element: (
      <DashboardSelector>
        <Schedule />
      </DashboardSelector>
    ),
    isProtected: true,
  },
  {
    path: "/dashboard/payment",
    element: (
      <DashboardSelector>
        <Payment />
      </DashboardSelector>
    ),
    isProtected: true,
  },
  {
    path: "/dashboard/bookings",
    element: (
      <DashboardSelector>
        <Bookings />
      </DashboardSelector>
    ),
    isProtected: true,
  },
  {
    path: "/dashboard/find-guides",
    element: (
      <DashboardSelector>
        <FindGuides />
      </DashboardSelector>
    ),
    isProtected: true,
  },
  {
    path: "/dashboard/progress",
    element: (
      <DashboardSelector>
        <LearningProgress />
      </DashboardSelector>
    ),
    isProtected: true,
  },
  // Admin Routes
  {
    path: "/dashboard/admin",
    element: (
      <DashboardSelector>
        <AdminDashboardHome />
      </DashboardSelector>
    ),
    isProtected: true,
  },
  {
    path: "/dashboard/guide-verifications",
    element: (
      <DashboardSelector>
        <GuideVerification />
      </DashboardSelector>
    ),
    isProtected: true,
  },
  {
    path: "/dashboard/users",
    element: (
      <DashboardSelector>
        <UserManagement />
      </DashboardSelector>
    ),
    isProtected: true,
  },
  {
    path: "/dashboard/stats",
    element: (
      <DashboardSelector>
        <DetailedStats />
      </DashboardSelector>
    ),
    isProtected: true,
  },
];

export default routes;

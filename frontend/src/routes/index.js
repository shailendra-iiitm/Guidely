import SignIn from "../page/signin";
import SignUp from "../page/signup";
import Home from "../page";
import PageNotFound from "../page/pageNotFound";
import AllGuides from "../page/allGuides";
import GuideDetails from "../page/guideDetails";
import Booking from "../page/booking";
import SuccessPage from "../page/successPage";


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
    element: <Booking />,
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
];

export default routes;

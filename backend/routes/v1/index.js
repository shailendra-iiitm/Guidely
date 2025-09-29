const express = require("express");

const router = express.Router();

const homeRoute = require("./home.route");
const authRoute = require("./auth.route");
const serviceRoute = require("./service.route");
const userRoute = require("./user.route");
const availabilityRoute = require("./availability.route");
const bookingRoute = require("./booking.route");
const webhookRoute = require("./webhook.route");
const guideRoute = require("./guide.route");
const learningProgressRoute = require("./learningProgress.route");
const paymentRoute = require("./payment.route");
const feedbackRoute = require("./feedback.route");
const guideVerificationRoute = require("./guideVerification.route");
const adminRoute = require("./admin.route");


const Routes = [
  {
    path: "/",
    route: homeRoute,
  },
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/service",
    route: serviceRoute,
  },
  {
    path: "/user",
    route: userRoute,
  },
  {
    path: "/availability",
    route: availabilityRoute,
  },
  {
    path: "/mentor",
    route: guideRoute,
  },
  {
    path: "/booking",
    route: bookingRoute,
  },
  {
    path: "/learning-progress",
    route: learningProgressRoute,
  },
  {
    path: "/payment",
    route: paymentRoute,
  },
  {
    path: "/feedback",
    route: feedbackRoute,
  },
  {
    path: "/webhook",
    route: webhookRoute,
  },
  {
    path: "/guide-verification",
    route: guideVerificationRoute,
  },
  {
    path: "/admin",
    route: adminRoute,
  },
];

Routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;

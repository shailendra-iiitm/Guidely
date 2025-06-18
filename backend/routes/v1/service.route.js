// backend/routes/v1/service.route.js

const express = require("express");
const serviceController = require("../../controllers/service.controller");
const asyncHandler = require("../../helper/asyncHandler");
const validate = require("../../middleware/validate");
const {
  createServiceSchema,
  updateServiceSchema,
} = require("../../validations/service.validation");
const authMiddleware = require("../../middleware/auth");

const router = express.Router();

router.post(
  "/",
  validate(createServiceSchema),
  authMiddleware.protect,
  authMiddleware.restrictTo("guide"),
  asyncHandler(serviceController.createService)
);

router.put(
  "/:serviceId",
  validate(updateServiceSchema),
  authMiddleware.protect,
  authMiddleware.restrictTo("guide"),
  asyncHandler(serviceController.updateService)
);

router.get(
  "/",
  authMiddleware.protect,
  authMiddleware.restrictTo("guide"),
  asyncHandler(serviceController.getServiceByGuide)
);

router.get(
  "/:serviceId",
  authMiddleware.protect,
  asyncHandler(serviceController.getServiceById)
);

module.exports = router;

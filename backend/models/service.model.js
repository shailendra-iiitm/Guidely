// backend/models/service.model.js

const { Schema, model } = require("mongoose");

const serviceSchema = new Schema(
  {
    guide: {  // changed from mentor to guide
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true, // Each service is linked to a guide
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: true, // Duration in minutes
    },
    price: {
      type: Number,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const ServiceModel = model("Service", serviceSchema);
module.exports = ServiceModel;

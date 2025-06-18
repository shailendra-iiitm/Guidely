// backend/models/availability.model.js

const { Schema, model } = require("mongoose");

const availabilitySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    weeklyAvailability: {
      monday: [{ startTime: String, endTime: String }],
      tuesday: [{ startTime: String, endTime: String }],
      wednesday: [{ startTime: String, endTime: String }],
      thursday: [{ startTime: String, endTime: String }],
      friday: [{ startTime: String, endTime: String }],
      saturday: [{ startTime: String, endTime: String }],
      sunday: [{ startTime: String, endTime: String }],
    },
    unavailableDates: [{ type: Date }],
  },
  { timestamps: true }
);

const AvailabilityModel = model("Availability", availabilitySchema);
module.exports = AvailabilityModel;

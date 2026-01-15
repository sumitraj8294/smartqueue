const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  name: String,
  phone: String,
  email: String,
  date: String,
  timeSlot: String,

  etaTime: Date, // actual ETA clock time

  status: {
    type: String,
    enum: ["PENDING", "IN_SERVICE", "COMPLETED"],
    default: "PENDING",
  },

  serviceStartedAt: Date,
  serviceCompletedAt: Date,

}, { timestamps: true });

module.exports = mongoose.model("Booking", BookingSchema);

const Booking = require("../models/Booking");
const { recalculateETA } = require("../services/eta.service");

/**
 * CREATE BOOKING
 * Rule: One ACTIVE (PENDING) booking per phone
 */
exports.createBooking = async (req, res) => {
  try {
    const booking = await Booking.create({
      ...req.body,
      userId: req.user.id,
      status: "PENDING",
    });

    // 🔥 ETA failure must NOT fail booking
    recalculateETA(booking.date, booking.timeSlot)
      .catch(err => console.error("ETA error:", err.message));

    res.status(201).json(booking);
  } catch (err) {
    console.error("Booking failed:", err);
    res.status(500).json({ message: "Booking failed" });
  }
};



/**
 * GET MY ACTIVE BOOKING
 */
exports.myBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      userId: req.user.id,
      status: "PENDING",
    }).sort({ createdAt: 1 });

    res.json(booking); // can be null
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch booking" });
  }
};

/**
 * GET ALL BOOKINGS (ADMIN)
 */
exports.allBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: 1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

/**
 * CANCEL BOOKING (USER)
 */
exports.cancelBooking = async (req, res) => {
  const booking = await Booking.findByIdAndDelete(req.params.id);

  if (!booking) {
    return res.status(400).json({ message: "Not found" });
  }

  await recalculateETA(booking.date, booking.timeSlot);

  res.json({ message: "Cancelled" });
};


/**
 * COMPLETE BOOKING (ADMIN)
 */
const { recalculateETAAfterCompletion } = require("../services/eta.service");

exports.completeBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking || booking.status !== "IN_SERVICE") {
    return res.status(400).json({ message: "Invalid booking state" });
  }

  // 1️⃣ Mark completed
  booking.status = "COMPLETED";
  booking.serviceCompletedAt = new Date();
  await booking.save();

  // 2️⃣ Delegate ALL ETA logic to service
  await recalculateETAAfterCompletion(booking);

  // 3️⃣ Respond
  res.json(booking);
};


exports.startService = async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking || booking.status !== "PENDING") {
    return res.status(400).json({ message: "Invalid booking" });
  }

  // ensure no one else is in service
  await Booking.updateMany(
    {
      date: booking.date,
      timeSlot: booking.timeSlot,
      status: "IN_SERVICE",
    },
    { status: "PENDING" }
  );

  booking.status = "IN_SERVICE";
  booking.serviceStartedAt = new Date();
  await booking.save();

  res.json(booking);
};
// const { recalculateETAAfterCompletion } = require("../services/eta.service");

exports.completeBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking || booking.status !== "IN_SERVICE") {
    return res.status(400).json({ message: "Not in service" });
  }

  booking.status = "COMPLETED";
  booking.serviceCompletedAt = new Date();
  await booking.save();

  await recalculateETAAfterCompletion(booking);

  res.json(booking);
};






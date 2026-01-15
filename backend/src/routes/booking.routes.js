const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const admin = require("../middlewares/admin.middleware");
const bookingController = require("../controllers/booking.controller");

/* ================= USER ================= */

router.post("/create", auth, bookingController.createBooking);
router.get("/mine", auth, bookingController.myBooking);
router.delete("/cancel/:id", auth, bookingController.cancelBooking);

/* ================= ADMIN ================= */

router.get("/admin/all", auth, admin, bookingController.allBookings);

router.post(
  "/admin/start/:id",
  auth,
  admin,
  bookingController.startService
);

router.put(
  "/admin/complete/:id",
  auth,
  admin,
  bookingController.completeBooking
);

router.delete(
  "/admin/cancel/:id",
  auth,
  admin,
  bookingController.cancelBooking
);

module.exports = router;

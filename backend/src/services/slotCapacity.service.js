const Booking = require("../models/Booking");

const SLOT_MINUTES = 120;
const BOOKING_MINUTES = 30;

function parseSlot(date, timeSlot) {
  const [start, end] = timeSlot.replace("–", "-").split("-");

  const format = (t) =>
    t.includes(":") ? t : t.replace(/(AM|PM)/, ":00 $1");

  const startTime = new Date(`${date} ${format(start.trim())}`);
  const endTime = new Date(`${date} ${format(end.trim())}`);

  return { startTime, endTime };
}

exports.getAllowedBookings = async (date, timeSlot) => {
  const { startTime, endTime } = parseSlot(date, timeSlot);
  const now = new Date();

  if (now >= endTime) return 0;

  const effectiveStart = now > startTime ? now : startTime;
  const remainingMinutes = Math.floor(
    (endTime - effectiveStart) / 60000
  );

  return Math.floor(remainingMinutes / BOOKING_MINUTES);
};

exports.isSlotAvailable = async (date, timeSlot) => {
  const allowed = await exports.getAllowedBookings(date, timeSlot);

  const existing = await Booking.countDocuments({
    date,
    timeSlot,
    status: { $in: ["PENDING", "IN_SERVICE"] },
  });

  return existing < allowed;
};

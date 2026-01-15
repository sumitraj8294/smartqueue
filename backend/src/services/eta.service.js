const Booking = require("../models/Booking");

const SERVICE_MIN = 15;
const BUFFER_MIN = 2;

/* ---------- SLOT START ---------- */
function parseSlotStart(date, timeSlot) {
  const normalized = timeSlot.replace("–", "-").toUpperCase();
  const start = normalized.split("-")[0].trim(); // "11AM"

  const formatted = start.includes(":")
    ? start.replace(/(AM|PM)/, " $1")
    : start.replace(/(AM|PM)/, ":00 $1");

  return new Date(`${date} ${formatted}`);
}

/* ---------- NORMAL RECALC (CANCEL / CREATE) ---------- */
exports.recalculateETA = async (date, timeSlot) => {
  const pending = await Booking.find({
    date,
    timeSlot,
    status: "PENDING",
  }).sort({ createdAt: 1 });

  const slotStart = parseSlotStart(date, timeSlot);
  const now = new Date();

  // ✅ START FROM CURRENT TIME IF SLOT ALREADY STARTED
  let nextTime = now > slotStart ? now : slotStart;

  for (const b of pending) {
    await Booking.findByIdAndUpdate(b._id, { etaTime: nextTime });
    nextTime = new Date(nextTime.getTime() + SERVICE_MIN * 60000);
  }
};


/* ---------- EARLY COMPLETION (BUFFER LOGIC) ---------- */
exports.recalculateETAAfterCompletion = async (completed) => {
  const { date, timeSlot } = completed;

  const pending = await Booking.find({
    date,
    timeSlot,
    status: "PENDING",
  }).sort({ etaTime: 1 });

  if (pending.length === 0) return;

  const now = new Date();

  // RULE: next user always starts AFTER buffer
  const nextETA = new Date(now.getTime() + BUFFER_MIN * 60000);

  // update first pending booking
  await Booking.findByIdAndUpdate(pending[0]._id, {
    etaTime: nextETA,
  });

  // chain remaining bookings normally
  let chainTime = new Date(nextETA.getTime() + SERVICE_MIN * 60000);

  for (let i = 1; i < pending.length; i++) {
    await Booking.findByIdAndUpdate(pending[i]._id, {
      etaTime: chainTime,
    });
    chainTime = new Date(chainTime.getTime() + SERVICE_MIN * 60000);
  }
};

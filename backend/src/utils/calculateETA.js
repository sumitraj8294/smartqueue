const { SLOT_START_TIME } = require("./slotTime");

function addMinutes(startTime, minutes) {
  if (!startTime) {
    throw new Error("Invalid slot start time");
  }

  const [h, m] = startTime.split(":").map(Number);

  const date = new Date();
  date.setHours(h);
  date.setMinutes(m + minutes);
  date.setSeconds(0);

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

exports.calculateETAs = async (bookings, slot) => {
  const startTime = SLOT_START_TIME[slot];

  if (!startTime) {
    console.error("❌ Invalid slot received:", slot);
    return;
  }

  let offset = 0;

  for (const booking of bookings) {
    booking.eta = addMinutes(startTime, offset);
    offset += 15;
    await booking.save();
  }
};

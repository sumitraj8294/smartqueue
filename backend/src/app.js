const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("SmartQueue API is running");
});

app.use("/auth", require("./routes/auth.routes"));
app.use("/booking", require("./routes/booking.routes"));

// app.use("/api/auth", require("./routes/auth.routes"));
// app.use("/api/booking", require("./routes/booking.routes"));
module.exports = app;

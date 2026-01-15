const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const admin = require("../config/admin");

exports.register = async (req, res) => {
  const { name, email, phone, password } = req.body;

  const exists = await User.findOne({ $or: [{ email }, { phone }] });
  if (exists) return res.status(400).json({ message: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name, email, phone, password: hashed
  });

  res.json({ message: "Registered successfully" });
};

exports.login = async (req, res) => {
  const { phone, password } = req.body;

  const user = await User.findOne({ phone });
  if (!user) return res.status(404).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, role: "USER" },
    process.env.JWT_SECRET
  );

  res.json({ token, user });
};

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (email !== admin.email || password !== admin.password) {
    return res.status(401).json({ message: "Invalid admin credentials" });
  }

  const token = jwt.sign(
    { role: "ADMIN" },
    process.env.JWT_SECRET
  );

  res.json({ token });
};

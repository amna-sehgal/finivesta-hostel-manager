import Warden from "../models/Warden.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ================= SIGNUP =================
export const wardenSignup = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, phone, hostel } = req.body;

    if (!fullName || !email || !password || !confirmPassword || !hostel)
      return res.status(400).json({ message: "Fill all required fields" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    const existing = await Warden.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await Warden.create({
      fullName,
      email,
      password: hashedPassword,
      phone,
      hostel
    });

    const warden = await Warden.findOne({ email });

    const token = jwt.sign(
      { id: warden._id, role: "warden" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: {
        id: warden._id,
        fullName: warden.fullName,
        email: warden.email,
        role: "warden",
        phone: warden.phone,
        hostel: warden.hostel
      }
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// ================= LOGIN =================
export const wardenLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const warden = await Warden.findOne({ email });
    if (!warden)
      return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, warden.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: warden._id, role: "warden" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: warden._id,
        fullName: warden.fullName,
        email: warden.email,
        role: "warden",
        phone: warden.phone,
        hostel: warden.hostel
      }
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

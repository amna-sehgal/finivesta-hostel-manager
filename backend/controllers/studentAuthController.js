import Student from "../models/Student.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ================= SIGNUP =================
export const studentSignup = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, phone, hostel, branch, entryDate, roomno } = req.body;

    if (!fullName || !email || !password || !confirmPassword || !hostel || !branch || !roomno)
      return res.status(400).json({ message: "Please fill all required fields" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    const existing = await Student.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = await Student.create({
      fullName,
      email,
      password: hashedPassword,
      phone,
      hostel,
      branch,
      entryDate,
      roomno
    });

    const token = jwt.sign(
      { id: newStudent._id, role: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: {
        id: newStudent._id,
        fullName: newStudent.fullName,
        email: newStudent.email,
        role: "student",
        phone: newStudent.phone,
        hostel: newStudent.hostel,
        branch: newStudent.branch,
        entryDate: newStudent.entryDate,
        roomno: newStudent.roomno
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// ================= LOGIN =================
export const studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });
    if (!student)
      return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: student._id, role: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: student._id,
        fullName: student.fullName,
        email: student.email,
        role: "student",
        phone: student.phone,
        hostel: student.hostel,
        branch: student.branch,
        entryDate: student.entryDate,
        roomno: student.roomno
      }
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// ================= UPDATE PROFILE =================
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.user;

    const updated = await Student.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    ).select("-password");

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

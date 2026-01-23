import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend is working!");
});

// ------------------ Student Signup ------------------
app.post("/api/student/signup", (req, res) => {
  const { fullName, email, password, confirmPassword, phone, hostel, branch, birthDate, roomno } = req.body;

  // Simple validation
  if (!fullName || !email || !password || !confirmPassword || !hostel || !branch || !birthDate || !roomno) {
    return res.status(400).json({ message: "Please fill all required fields" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  // Read existing students
  const studentsData = JSON.parse(fs.readFileSync("students.json", "utf-8"));

  // Check if email already exists
  const existingStudent = studentsData.find(student => student.email === email);
  if (existingStudent) {
    return res.status(400).json({ message: "Email already registered" });
  }

  // Create new student object
  const newStudent = { fullName, email, password, phone, hostel, branch, birthDate, roomno };

  // Add to array and save
  studentsData.push(newStudent);
  fs.writeFileSync("students.json", JSON.stringify(studentsData, null, 2));

  res.status(201).json({ message: "Signup successful", student: newStudent });
});

// ------------------ Student Login ------------------
app.post("/api/student/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const studentsData = JSON.parse(fs.readFileSync("students.json", "utf-8"));
  const student = studentsData.find(s => s.email === email && s.password === password);

  if (!student) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.status(200).json({ message: "Login successful", student });
});

// Start server
app.listen(PORT, () => {
  console.log(`Mock backend running on http://localhost:${PORT}`);
});

// ------------------ Warden Signup ------------------
app.post("/api/warden/signup", (req, res) => {
  const { fullName, email, password, confirmPassword, phone, hostel } = req.body;

  if (!fullName || !email || !password || !confirmPassword || !hostel) {
    return res.status(400).json({ message: "Please fill all required fields" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  // Read existing wardens
  const wardensData = JSON.parse(fs.readFileSync("wardens.json", "utf-8"));

  // Check if email already exists
  const existingWarden = wardensData.find(w => w.email === email);
  if (existingWarden) {
    return res.status(400).json({ message: "Email already registered" });
  }

  // Create new warden object
  const newWarden = { fullName, email, password, phone, hostel };

  // Add to array and save
  wardensData.push(newWarden);
  fs.writeFileSync("wardens.json", JSON.stringify(wardensData, null, 2));

  res.status(201).json({ message: "Signup successful", warden: newWarden });
});

// ------------------ Warden Login ------------------
app.post("/api/warden/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const wardensData = JSON.parse(fs.readFileSync("wardens.json", "utf-8"));
  const warden = wardensData.find(w => w.email === email && w.password === password);

  if (!warden) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.status(200).json({ message: "Login successful", warden });
});


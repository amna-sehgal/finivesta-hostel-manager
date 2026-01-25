import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Ensure JSON files exist
if (!fs.existsSync("students.json")) fs.writeFileSync("students.json", "[]");
if (!fs.existsSync("wardens.json")) fs.writeFileSync("wardens.json", "[]");
if (!fs.existsSync("studentFeedback.json")) fs.writeFileSync("studentFeedback.json", "[]");
if (!fs.existsSync("mess.json")) {
  fs.writeFileSync("mess.json", JSON.stringify({
    weekly: {},
    pollOptions: [],
    demandBox: []
  }, null, 2));
}

// ------------------ Student Signup/Login ------------------
app.post("/api/student/signup", (req, res) => {
  const { fullName, email, password, confirmPassword, phone, hostel, branch, entryDate, roomno } = req.body;
  if (!fullName || !email || !password || !confirmPassword || !hostel || !branch || !entryDate || !roomno)
    return res.status(400).json({ message: "Please fill all required fields" });
  if (password !== confirmPassword) return res.status(400).json({ message: "Passwords do not match" });

  const studentsData = JSON.parse(fs.readFileSync("students.json", "utf-8"));
  if (studentsData.find(s => s.email === email)) return res.status(400).json({ message: "Email already registered" });

  const newStudent = { fullName, email, password, phone, hostel, branch, entryDate, roomno };
  studentsData.push(newStudent);
  fs.writeFileSync("students.json", JSON.stringify(studentsData, null, 2));

  res.status(201).json({ message: "Signup successful", student: newStudent });
});

app.post("/api/student/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

  const studentsData = JSON.parse(fs.readFileSync("students.json", "utf-8"));
  const student = studentsData.find(s => s.email === email && s.password === password);
  if (!student) return res.status(401).json({ message: "Invalid email or password" });

  res.status(200).json({ message: "Login successful", student });
});

// ------------------ Warden Signup/Login ------------------
app.post("/api/warden/signup", (req, res) => {
  const { fullName, email, password, confirmPassword, phone, hostel } = req.body;
  if (!fullName || !email || !password || !confirmPassword || !hostel)
    return res.status(400).json({ message: "Please fill all required fields" });
  if (password !== confirmPassword) return res.status(400).json({ message: "Passwords do not match" });

  const wardensData = JSON.parse(fs.readFileSync("wardens.json", "utf-8"));
  if (wardensData.find(w => w.email === email)) return res.status(400).json({ message: "Email already registered" });

  const newWarden = { fullName, email, password, phone, hostel };
  wardensData.push(newWarden);
  fs.writeFileSync("wardens.json", JSON.stringify(wardensData, null, 2));

  res.status(201).json({ message: "Signup successful", warden: newWarden });
});

app.post("/api/warden/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

  const wardensData = JSON.parse(fs.readFileSync("wardens.json", "utf-8"));
  const warden = wardensData.find(w => w.email === email && w.password === password);
  if (!warden) return res.status(401).json({ message: "Invalid email or password" });

  res.status(200).json({ message: "Login successful", warden });
});

// ------------------ Mess Backend ------------------
const messDataPath = "mess.json";
const studentFeedbackPath = "studentFeedback.json";

// Helper: get today's day string
function getTodayDay() {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[new Date().getDay()];
}

// GET today's menu for student
app.get("/api/mess/student", (req, res) => {
  try {
    const messData = JSON.parse(fs.readFileSync(messDataPath, "utf-8"));
    const feedbackData = JSON.parse(fs.readFileSync(studentFeedbackPath, "utf-8"));

    const today = getTodayDay();
    res.json({
      menu: messData.weekly[today],
      pollOptions: messData.pollOptions,
      demandBox: messData.demandBox,
      previousFeedback: feedbackData
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST student feedback
app.post("/api/mess/student/feedback", (req, res) => {
  try {
    const { studentName, rating, feedback, pollChoice } = req.body;
    if (!studentName) return res.status(400).json({ message: "Student name required" });
    if (!rating && !feedback && !pollChoice) return res.status(400).json({ message: "At least one feedback required" });

    const feedbackData = JSON.parse(fs.readFileSync(studentFeedbackPath, "utf-8"));
    feedbackData.push({
      studentName,
      rating: rating || null,
      feedback: feedback || null,
      pollChoice: pollChoice || null,
      date: new Date()
    });
    fs.writeFileSync(studentFeedbackPath, JSON.stringify(feedbackData, null, 2));

    res.status(200).json({ message: "Feedback submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET weekly menu + poll results + demand + rating summary for warden
// GET weekly menu + poll results + demand + ratings grouped by day
app.get("/api/mess/warden", (req, res) => {
  try {
    const messData = JSON.parse(fs.readFileSync(messDataPath, "utf-8"));
    const feedbackData = JSON.parse(fs.readFileSync(studentFeedbackPath, "utf-8"));

    // Poll results
    // Poll results (TODAY ONLY)
    const pollResults = {};
    const today = new Date().toDateString();

    feedbackData.forEach(f => {
      if (
        f.pollChoice &&
        new Date(f.date).toDateString() === today
      ) {
        pollResults[f.pollChoice] =
          (pollResults[f.pollChoice] || 0) + 1;
      }
    });

    // Demand summary
    const issues = feedbackData.map(f => f.feedback).filter(f => f);

    // Ratings grouped by day
    const ratingsByDay = {};
    feedbackData.forEach(f => {
      const day = new Date(f.date).toLocaleDateString("en-US", { weekday: "long" });
      if (f.rating) {
        if (!ratingsByDay[day]) ratingsByDay[day] = [];
        ratingsByDay[day].push(f.rating);
      }
    });
    Object.keys(ratingsByDay).forEach(day => {
      const arr = ratingsByDay[day];
      ratingsByDay[day] = arr.reduce((a, b) => a + b, 0) / arr.length;
    });

    res.status(200).json({
      weekMenu: messData.weekly,
      pollResults,
      demandSummary: issues,
      ratingsByDay
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// POST warden updates weekly menu
app.post("/api/mess/warden/menu", (req, res) => {
  try {
    const { weeklyMenu } = req.body;
    if (!weeklyMenu) return res.status(400).json({ message: "Weekly menu required" });

    const messData = JSON.parse(fs.readFileSync(messDataPath, "utf-8"));
    messData.weekly = weeklyMenu;
    fs.writeFileSync(messDataPath, JSON.stringify(messData, null, 2));

    res.status(200).json({ message: "Weekly menu updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/mess/warden/reset", (req, res) => {
  try {
    const feedbackData = JSON.parse(
      fs.readFileSync(studentFeedbackPath, "utf-8")
    );

    const today = new Date().toDateString();

    const filteredFeedback = feedbackData.filter(
      f => new Date(f.date).toDateString() !== today
    );

    fs.writeFileSync(
      studentFeedbackPath,
      JSON.stringify(filteredFeedback, null, 2)
    );

    res.status(200).json({ message: "Today's poll and demand reset" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Warden sets poll options
app.post("/api/mess/warden/poll", (req, res) => {
  const { options } = req.body;
  if (!Array.isArray(options)) {
    return res.status(400).json({ message: "Options must be array" });
  }

  const messData = JSON.parse(fs.readFileSync(messDataPath, "utf-8"));
  messData.pollOptions = options;
  fs.writeFileSync(messDataPath, JSON.stringify(messData, null, 2));

  res.json({ message: "Poll options updated" });
});



app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));




import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";


const notificationPath = "notifications.json";

if (!fs.existsSync(notificationPath)) {
  fs.writeFileSync(
    notificationPath,
    JSON.stringify({ notifications: [] }, null, 2)
  );
}

const readNotifications = () =>
  JSON.parse(fs.readFileSync(notificationPath, "utf-8"));

const writeNotifications = (data) =>
  fs.writeFileSync(notificationPath, JSON.stringify(data, null, 2));

const createNotification = ({
  type,
  title,
  message,
  receiver,
  studentEmail,
}) => {
  const data = readNotifications();

  data.notifications.unshift({
    id: Date.now().toString(),
    type,
    title,
    message,
    receiver,
    studentEmail: studentEmail || null,
    read: false,
    createdAt: new Date().toISOString(),
  });

  writeNotifications(data);
};

const app = express();
const PORT = 5000;


// Middleware
app.use(cors());
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

const laundryDataPath = "laundry.json";

// Ensure JSON file exists
if (!fs.existsSync(laundryDataPath)) {
  fs.writeFileSync(laundryDataPath, JSON.stringify({ requests: [] }, null, 2));
}

// GET all laundry requests for a student
app.get("/api/laundry/student/:email", (req, res) => {
  try {
    const { email } = req.params;
    const laundryData = JSON.parse(fs.readFileSync(laundryDataPath, "utf-8"));
    const studentRequests = laundryData.requests.filter(
      (r) => r.studentEmail === email
    );
    res.status(200).json({ requests: studentRequests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST new laundry request
app.post("/api/laundry/student/request", (req, res) => {
  try {
    const { studentEmail, type, instructions } = req.body;
    if (!studentEmail || !type) {
      return res
        .status(400)
        .json({ message: "Student email and laundry type are required" });
    }

    const laundryData = JSON.parse(fs.readFileSync(laundryDataPath, "utf-8"));

    const newRequest = {
      id: Date.now().toString(),
      studentEmail,
      type,
      instructions: instructions || "",
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    laundryData.requests.push(newRequest);
    fs.writeFileSync(laundryDataPath, JSON.stringify(laundryData, null, 2));

    res.status(201).json({ message: "Laundry request created", request: newRequest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET all laundry requests (warden)
app.get("/api/laundry/warden", (req, res) => {
  try {
    const laundryData = JSON.parse(fs.readFileSync(laundryDataPath, "utf-8"));
    res.status(200).json({ requests: laundryData.requests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH update laundry request status (warden)
app.patch("/api/laundry/warden/update/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { status, pickupDate } = req.body;
    if (!status)
      return res.status(400).json({ message: "Status is required" });

    const laundryData = JSON.parse(fs.readFileSync(laundryDataPath, "utf-8"));
    const requestIndex = laundryData.requests.findIndex((r) => r.id === id);
    if (requestIndex === -1)
      return res.status(404).json({ message: "Request not found" });

    laundryData.requests[requestIndex].status = status;
    if (pickupDate) laundryData.requests[requestIndex].pickupDate = pickupDate;
    fs.writeFileSync(laundryDataPath, JSON.stringify(laundryData, null, 2));

    res
      .status(200)
      .json({ message: "Request status updated", request: laundryData.requests[requestIndex] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

const outpassDataPath = "outpass.json";

// Ensure JSON exists
if (!fs.existsSync(outpassDataPath)) {
  fs.writeFileSync(
    outpassDataPath,
    JSON.stringify({ requests: [] }, null, 2)
  );
}

const readOutpass = () =>
  JSON.parse(fs.readFileSync(outpassDataPath, "utf-8"));

const writeOutpass = (data) =>
  fs.writeFileSync(outpassDataPath, JSON.stringify(data, null, 2));

/* ================= STUDENT ================= */

app.post("/api/outpass/student/request", (req, res) => {
  try {
    const { reason, fromDate, toDate, parentApproval, studentEmail } = req.body;

    if (!reason || !fromDate || !toDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const outpassData = readOutpass();
    const newRequest = {
      id: Date.now().toString(),
      studentEmail,
      reason,
      fromDate,
      toDate,
      parentApproval: parentApproval || false,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    if (!reason || !fromDate || !toDate || !studentEmail) {
      return res.status(400).json({ message: "Missing required fields" });
    }


    outpassData.requests.unshift(newRequest);
    writeOutpass(outpassData);

    res.status(201).json({ request: newRequest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/notifications/student/:email", (req, res) => {
  try {
    const { email } = req.params;
    const data = readNotifications();

    const studentNotifications = data.notifications.filter((n) => {
      if (n.receiver === "students") return true; // everyone
      if (n.receiver === "student" && n.studentEmail) {
        return n.studentEmail === email;
      }
      return false;
    });

    // Sort newest first
    studentNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ notifications: studentNotifications });
  } catch (err) {
    console.error("STUDENT NOTIFICATION ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/* ================= WARDEN ================= */

app.get("/api/outpass/warden/pending", (req, res) => {
  try {
    const outpassData = readOutpass();
    res.json({
      requests: outpassData.requests.filter(
        (r) => r.status === "Pending"
      ),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/notifications/warden", (req, res) => {
  try {
    const { title, message, studentEmail } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: "Title and message required" });
    }

    createNotification({
      type: "manual",
      title,
      message,
      receiver: studentEmail ? "student" : "students",
      studentEmail: studentEmail || null,
    });

    res.status(201).json({ message: "Notification sent successfully" });
  } catch (err) {
    console.error("WARDEN NOTIFICATION ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/outpass/student/:email", (req, res) => {
  try {
    const { email } = req.params;
    const outpassData = readOutpass();
    const studentRequests = outpassData.requests.filter(
      (r) => r.studentEmail === email
    );
    res.json({ requests: studentRequests });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});



app.patch("/api/outpass/warden/update/:id", (req, res) => {
  try {
    const { status } = req.body;
    const outpassData = readOutpass();

    const index = outpassData.requests.findIndex(
      (r) => r.id === req.params.id
    );

    if (index === -1)
      return res.status(404).json({ message: "Not found" });

    outpassData.requests[index].status = status;
    writeOutpass(outpassData);

    const reqData = outpassData.requests[index];

    // 🔔 CREATE NOTIFICATION
    createNotification({
      type: "outpass",
      title: status === "Approved" ? "Outpass Approved" : "Outpass Rejected",
      message:
        status === "Approved"
          ? `Your outpass from ${reqData.fromDate} to ${reqData.toDate} has been approved.`
          : `Your outpass request has been rejected.`,
      receiver: "student",
      studentEmail: reqData.studentEmail,
    });

    res.json({ request: reqData });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/notifications/warden", (req, res) => {
  try {
    const data = readNotifications();
    res.json({ notifications: data.notifications });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/api/notifications/warden/:id", (req, res) => {
  try {
    const { id } = req.params;
    const data = readNotifications();

    const originalLength = data.notifications.length;

    data.notifications = data.notifications.filter(
      (n) => n.id !== id
    );

    if (data.notifications.length === originalLength) {
      return res.status(404).json({ message: "Notice not found" });
    }

    writeNotifications(data);

    res.status(200).json({ message: "Notice deleted successfully" });
  } catch (err) {
    console.error("DELETE NOTICE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

const EXPENSES_FILE = "./expenses.json";


if (!fs.existsSync(EXPENSES_FILE)) {
  fs.writeFileSync(
    EXPENSES_FILE,
    JSON.stringify({ students: {} }, null, 2)
  );
}


/* ---------- helpers ---------- */
const readExpenses = () => {
  const data = fs.readFileSync(EXPENSES_FILE, "utf-8");
  return JSON.parse(data);
};

const writeExpenses = (data) => {
  fs.writeFileSync(EXPENSES_FILE, JSON.stringify(data, null, 2));
};

/* ---------- GET expenses ---------- */
app.get("/api/expenses/:studentId", (req, res) => {
  const { studentId } = req.params;
  const data = readExpenses();

  if (!data.students[studentId]) {
    data.students[studentId] = {
      monthlyBudget: 0,
      expenses: [],
    };
    writeExpenses(data);
  }

  res.json(data.students[studentId]);
});

/* ---------- SET monthly budget ---------- */
app.post("/api/expenses/:studentId/budget", (req, res) => {
  const { studentId } = req.params;
  const { monthlyBudget } = req.body;

  const data = readExpenses();

  if (!data.students[studentId]) {
    data.students[studentId] = {
      monthlyBudget: 0,
      expenses: [],
    };
  }

  data.students[studentId].monthlyBudget = monthlyBudget;
  writeExpenses(data);

  res.json({ success: true });
});

/* ---------- ADD expense ---------- */
app.post("/api/expenses/:studentId/add", (req, res) => {
  const { studentId } = req.params;
  const { amount, category, note, date } = req.body;

  const data = readExpenses();

  if (!data.students[studentId]) {
    data.students[studentId] = {
      monthlyBudget: 0,
      expenses: [],
    };
  }

  const newExpense = {
    id: Date.now(),
    amount,
    category,
    note,
    date,
  };

  data.students[studentId].expenses.push(newExpense);
  writeExpenses(data);

  res.json(newExpense);
});

/* ---------- DELETE expense (optional but good) ---------- */
app.delete("/api/expenses/:studentId/:expenseId", (req, res) => {
  const { studentId, expenseId } = req.params;
  const data = readExpenses();

  if (!data.students[studentId]) {
    return res.status(404).json({ error: "Student not found" });
  }

  data.students[studentId].expenses = data.students[studentId].expenses.filter(
    (e) => e.id != expenseId
  );

  writeExpenses(data);
  res.json({ success: true });
});


// Start server
app.listen(5000, () => console.log("Server running on port 5000"));
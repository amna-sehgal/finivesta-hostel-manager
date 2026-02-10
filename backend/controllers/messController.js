import MessMenu from "../models/MessMenu.js";
import MessFeedback from "../models/MessFeedback.js";

function getTodayDay() {
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  return days[new Date().getDay()];
}

// ---------------- STUDENT ----------------

export const getStudentMess = async (req, res) => {
  try {
    const menuDoc = await MessMenu.findOne();
    const feedbackData = await MessFeedback.find();

    const today = getTodayDay();

    res.json({
      menu: menuDoc.weekly[today],
      pollOptions: menuDoc.pollOptions,
      previousFeedback: feedbackData,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const submitFeedback = async (req, res) => {
  try {
    const { studentName, rating, feedback, pollChoice } = req.body;

    const newFeedback = new MessFeedback({
      studentName,
      rating,
      feedback,
      pollChoice,
    });

    await newFeedback.save();

    res.json({ message: "Feedback submitted" });
  } catch {
    res.status(500).json({ message: "Error" });
  }
};

// ---------------- WARDEN ----------------

export const getWardenData = async (req, res) => {
  try {
    const menuDoc = await MessMenu.findOne();
    const feedbackData = await MessFeedback.find();

    // Poll results today
    const pollResults = {};
    const today = new Date().toDateString();

    feedbackData.forEach(f => {
      if (f.pollChoice && new Date(f.date).toDateString() === today) {
        pollResults[f.pollChoice] = (pollResults[f.pollChoice] || 0) + 1;
      }
    });

    // Demand
    const issues = feedbackData.map(f => f.feedback).filter(Boolean);

    // Ratings by day
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
      ratingsByDay[day] = arr.reduce((a,b)=>a+b,0)/arr.length;
    });

    res.json({
      weekMenu: menuDoc.weekly,
      pollResults,
      demandSummary: issues,
      ratingsByDay,
    });
  } catch {
    res.status(500).json({ message: "Error" });
  }
};

export const updateMenu = async (req, res) => {
  try {
    const { weeklyMenu } = req.body;

    await MessMenu.findOneAndUpdate({}, { weekly: weeklyMenu });

    res.json({ message: "Menu updated" });
  } catch {
    res.status(500).json({ message: "Error" });
  }
};

export const resetToday = async (req, res) => {
  try {
    const today = new Date().toDateString();

    const all = await MessFeedback.find();
    const filtered = all.filter(
      f => new Date(f.date).toDateString() !== today
    );

    await MessFeedback.deleteMany({});
    await MessFeedback.insertMany(filtered);

    res.json({ message: "Reset done" });
  } catch {
    res.status(500).json({ message: "Error" });
  }
};

export const updatePoll = async (req, res) => {
  const { options } = req.body;

  await MessMenu.findOneAndUpdate({}, { pollOptions: options });

  res.json({ message: "Poll updated" });
};

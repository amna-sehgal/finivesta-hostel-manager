import Notification from "../models/Notification.js";

/* CREATE NOTIFICATION */
export const createNotification = async (req, res) => {
  try {
    const { type, title, message, receiver, studentEmail } = req.body;
    if (!type || !title || !message || !receiver)
      return res.status(400).json({ message: "Missing required fields" });

    const newNotification = new Notification({
      type,
      title,
      message,
      receiver,
      studentEmail: studentEmail || null,
    });

    await newNotification.save();
    res.status(201).json(newNotification);
  } catch (err) {
    console.error("CREATE NOTIFICATION ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* GET NOTIFICATIONS FOR STUDENT */
export const getStudentNotifications = async (req, res) => {
  try {
    const { email } = req.params;
    const notifications = await Notification.find({
      $or: [
        { receiver: "students" },
        { receiver: "student", studentEmail: email },
      ],
    }).sort({ createdAt: -1 });

    res.json({ notifications });
  } catch (err) {
    console.error("STUDENT NOTIFICATIONS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* GET NOTIFICATIONS FOR WARDEN */
export const getWardenNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      $or: [{ receiver: "warden" }, { type: "manual" }],
    }).sort({ createdAt: -1 });
    res.json({ notifications });
  } catch (err) {
    console.error("WARDEN NOTIFICATIONS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* DELETE NOTIFICATION */
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Notification.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Notice not found" });

    res.status(200).json({ message: "Notice deleted successfully" });
  } catch (err) {
    console.error("DELETE NOTICE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

import Outpass from "../models/Outpass.js";
import { createNotification } from "./notificationController.js"; // your existing notifications function

/* ================= STUDENT ================= */

// Create outpass request
export const createOutpassRequest = async (req, res) => {
  try {
    const { reason, fromDate, toDate, parentApproval, studentEmail } = req.body;
    if (!reason || !fromDate || !toDate || !studentEmail)
      return res.status(400).json({ message: "Missing required fields" });

    const newRequest = await Outpass.create({
      studentEmail,
      reason,
      fromDate,
      toDate,
      parentApproval: parentApproval || false,
    });

    res.status(201).json({ request: newRequest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get student's outpass requests
export const getStudentOutpasses = async (req, res) => {
  try {
    const studentRequests = await Outpass.find({ studentEmail: req.params.email }).sort({ createdAt: -1 });
    res.json({ requests: studentRequests });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= WARDEN ================= */

// Get pending requests
export const getPendingOutpasses = async (req, res) => {
  try {
    const pendingRequests = await Outpass.find({ status: "Pending" }).sort({ createdAt: -1 });
    res.json({ requests: pendingRequests });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update request status
export const updateOutpassStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await Outpass.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!request) return res.status(404).json({ message: "Request not found" });

    // 🔔 Notification
    createNotification({
      type: "outpass",
      title: status === "Approved" ? "Outpass Approved" : "Outpass Rejected",
      message:
        status === "Approved"
          ? `Your outpass from ${request.fromDate.toDateString()} to ${request.toDate.toDateString()} has been approved.`
          : `Your outpass request has been rejected.`,
      receiver: "student",
      studentEmail: request.studentEmail,
    });

    res.json({ request });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

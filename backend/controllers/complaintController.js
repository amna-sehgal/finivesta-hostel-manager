import Complaint from "../models/Complaint.js";
import { createNotification } from "./notificationController.js"; // keep your existing function

/* ---------------- STUDENT CREATE ---------------- */
export const createComplaint = async (req, res) => {
  try {
    const {
      studentEmail,
      studentName,
      hostel,
      roomNumber,
      category,
      description,
      priority
    } = req.body;

    if (!studentEmail || !category || !description) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const complaint = await Complaint.create({
      studentEmail,
      studentName,
      hostel,
      roomNumber,
      category,
      description,
      priority: priority || "Normal"
    });

    // 🔔 notify warden
    createNotification({
      type: "complaint",
      title: "New Complaint Raised",
      message: `${category} complaint raised by ${studentName}`,
      receiver: "warden"
    });

    res.status(201).json({
      complaint: { ...complaint.toObject(), id: complaint._id }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- STUDENT GET OWN ---------------- */
export const getStudentComplaints = async (req, res) => {
  const { email } = req.params;

  const complaints = await Complaint.find({ studentEmail: email })
    .sort({ createdAt: -1 });

  res.json({
    complaints: complaints.map(c => ({ ...c.toObject(), id: c._id }))
  });
};

/* ---------------- WARDEN GET ALL ---------------- */
export const getAllComplaints = async (req, res) => {
  const complaints = await Complaint.find().sort({ createdAt: -1 });

  res.json({
    complaints: complaints.map(c => ({ ...c.toObject(), id: c._id }))
  });
};

/* ---------------- UPDATE STATUS ---------------- */
export const updateComplaintStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const complaint = await Complaint.findById(id);
  if (!complaint) {
    return res.status(404).json({ message: "Complaint not found" });
  }

  complaint.status = status;

  if (status === "Resolved") {
    complaint.resolvedAt = new Date();

    // 🔔 notify student
    createNotification({
      type: "complaint",
      title: "Complaint Resolved",
      message: `Your ${complaint.category} complaint has been resolved.`,
      receiver: "student",
      studentEmail: complaint.studentEmail
    });
  }

  await complaint.save();

  res.json({
    complaint: { ...complaint.toObject(), id: complaint._id }
  });
};

/* ---------------- ACTIVE COUNT ---------------- */
export const getActiveCount = async (req, res) => {
  const count = await Complaint.countDocuments({
    status: { $ne: "Resolved" }
  });

  res.json({ count });
};

/* ---------------- DELETE STUDENT ---------------- */
export const deleteComplaint = async (req, res) => {
  const { id } = req.params;

  const deleted = await Complaint.findByIdAndDelete(id);
  if (!deleted) {
    return res.status(404).json({ message: "Complaint not found" });
  }

  res.json({ success: true });
};

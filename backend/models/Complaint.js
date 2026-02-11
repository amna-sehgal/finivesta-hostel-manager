import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  studentEmail: { type: String, required: true },
  studentName: String,
  hostel: String,
  roomNumber: String,

  category: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, default: "Normal" },

  status: { type: String, default: "Pending" },

  createdAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date, default: null }
});

export default mongoose.model("Complaint", complaintSchema);

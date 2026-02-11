import mongoose from "mongoose";

const sosSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  roomNumber: { type: String, required: true },
  hostel: { type: String },
  issue: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: "active", enum: ["active", "resolved"] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("SOS", sosSchema);

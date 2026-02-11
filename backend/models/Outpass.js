import mongoose from "mongoose";

const outpassSchema = new mongoose.Schema({
  studentEmail: { type: String, required: true },
  reason: { type: String, required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  parentApproval: { type: Boolean, default: false },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

const Outpass = mongoose.model("Outpass", outpassSchema);
export default Outpass;

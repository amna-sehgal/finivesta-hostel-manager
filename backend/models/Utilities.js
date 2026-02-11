import mongoose from "mongoose";

const utilitySchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  title: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  paidBy: { type: String, required: true }, // student email
  participants: [{ type: String, required: true }], // student emails
  splitAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Utility", utilitySchema);

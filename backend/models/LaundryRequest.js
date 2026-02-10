import mongoose from "mongoose";

const laundrySchema = new mongoose.Schema({
  studentEmail: String,
  type: String,
  instructions: String,
  status: {
    type: String,
    default: "Pending",
  },
  pickupDate: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("LaundryRequest", laundrySchema);

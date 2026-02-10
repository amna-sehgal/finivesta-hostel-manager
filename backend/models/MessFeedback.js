import mongoose from "mongoose";

const messFeedbackSchema = new mongoose.Schema({
  studentName: String,
  rating: Number,
  feedback: String,
  pollChoice: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("MessFeedback", messFeedbackSchema);

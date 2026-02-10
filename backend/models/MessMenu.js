import mongoose from "mongoose";

const daySchema = new mongoose.Schema({
  breakfast: String,
  lunch: String,
  dinner: String,
});

const messMenuSchema = new mongoose.Schema({
  weekly: {
    Monday: daySchema,
    Tuesday: daySchema,
    Wednesday: daySchema,
    Thursday: daySchema,
    Friday: daySchema,
    Saturday: daySchema,
    Sunday: daySchema,
  },
  pollOptions: [String],
});

export default mongoose.model("MessMenu", messMenuSchema);

import mongoose from "mongoose";

const wardenSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  hostel: { type: String, required: true }
}, { timestamps: true });

const Warden = mongoose.model("Warden", wardenSchema);
export default Warden;

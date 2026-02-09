import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  hostel: { type: String, required: true },
  branch: { type: String, required: true },
  entryDate: String,
  birthDate: String,
  roomno: { type: String, required: true }
}, { timestamps: true });

const Student = mongoose.model("Student", studentSchema);
export default Student;

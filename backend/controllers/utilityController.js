import Utility from "../models/Utilities.js";
import Student from "../models/Student.js"; // Assuming you already have a Student model

/* ---------- GET ALL BILLS FOR A ROOM ---------- */
export const getRoomBills = async (req, res) => {
  const { roomId } = req.params;
  try {
    const bills = await Utility.find({ roomId }).sort({ createdAt: -1 });
    res.json(bills);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------- GET ROOMMATES ---------- */
export const getRoommates = async (req, res) => {
  const { roomId } = req.params;
  try {
    const roommates = await Student.find({ roomno: roomId }).select("fullName email -_id");
    res.json({ roommates });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------- ADD A BILL ---------- */
export const addBill = async (req, res) => {
  const { roomId } = req.params;
  const { title, totalAmount, paidBy, participants } = req.body;

  if (!title || !totalAmount || !paidBy || !participants?.length) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const splitAmount = totalAmount / participants.length;
    const newBill = await Utility.create({
      roomId,
      title,
      totalAmount,
      paidBy,
      participants,
      splitAmount,
    });
    res.status(201).json(newBill);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------- DELETE A BILL ---------- */
export const deleteBill = async (req, res) => {
  const { roomId, billId } = req.params;
  try {
    const deleted = await Utility.findOneAndDelete({ _id: billId, roomId });
    if (!deleted) return res.status(404).json({ message: "Bill not found" });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

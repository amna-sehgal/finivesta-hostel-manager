import SOS from "../models/SOS.js";

/* ---------- CREATE NEW SOS ---------- */
export const createSOS = async (req, res) => {
  try {
    const { studentName, roomNumber, hostel, issue, message } = req.body;
    if (!studentName || !roomNumber || !issue || !message) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const newSOS = await SOS.create({ studentName, roomNumber, hostel, issue, message });
    res.status(201).json({ success: true, sos: newSOS });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ---------- GET ALL SOS ---------- */
export const getAllSOS = async (req, res) => {
  try {
    const sos = await SOS.find().sort({ createdAt: -1 });
    res.json(sos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------- GET ACTIVE SOS ---------- */
export const getActiveSOS = async (req, res) => {
  try {
    const sos = await SOS.find({ status: "active" }).sort({ createdAt: -1 });
    res.json(sos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------- RESOLVE SOS ---------- */
export const resolveSOS = async (req, res) => {
  try {
    const { id } = req.params;
    const sos = await SOS.findById(id);
    if (!sos) return res.status(404).json({ success: false, message: "SOS not found" });

    sos.status = "resolved";
    await sos.save();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

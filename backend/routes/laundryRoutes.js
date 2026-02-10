import express from "express";
import LaundryRequest from "../models/LaundryRequest.js";
import MachineStats from "../models/MachineStats.js";

const router = express.Router();


// STUDENT — GET requests
router.get("/student/:email", async (req, res) => {
  try {
    const requests = await LaundryRequest.find({
      studentEmail: req.params.email,
    }).sort({ createdAt: -1 });

    res.json({ requests });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// STUDENT — create request
router.post("/student/request", async (req, res) => {
  try {
    const { studentEmail, type, instructions } = req.body;

    const request = await LaundryRequest.create({
      studentEmail,
      type,
      instructions,
    });

    res.status(201).json({ request });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});


// STUDENT — cancel
router.patch("/student/cancel/:id", async (req, res) => {
  try {
    const request = await LaundryRequest.findById(req.params.id);

    if (!request)
      return res.status(404).json({ message: "Not found" });

    if (request.status !== "Pending")
      return res
        .status(400)
        .json({ message: "Can only cancel pending requests" });

    await request.deleteOne();

    res.json({ message: "Cancelled" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});


// WARDEN — get all
router.get("/warden", async (req, res) => {
  const requests = await LaundryRequest.find().sort({ createdAt: -1 });
  res.json({ requests });
});


// WARDEN — update
router.patch("/warden/update/:id", async (req, res) => {
  try {
    const { status, pickupDate } = req.body;

    const request = await LaundryRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Not found" });

    if (status) request.status = status;
    if (pickupDate) request.pickupDate = pickupDate;

    await request.save();

    res.json({ request });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});


// MACHINE STATS — get
router.get("/machine-stats", async (req, res) => {
  let stats = await MachineStats.findOne();

  if (!stats) {
    stats = await MachineStats.create({
      total: 24,
      operational: 21,
      maintenance: 2,
      outOfService: 1,
    });
  }

  res.json(stats);
});


// MACHINE STATS — update
router.post("/machine-stats", async (req, res) => {
  const { total, operational, maintenance, outOfService } = req.body;

  let stats = await MachineStats.findOne();

  if (!stats) {
    stats = await MachineStats.create({
      total,
      operational,
      maintenance,
      outOfService,
    });
  } else {
    stats.total = total;
    stats.operational = operational;
    stats.maintenance = maintenance;
    stats.outOfService = outOfService;
    await stats.save();
  }

  res.json({ stats });
});

export default router;

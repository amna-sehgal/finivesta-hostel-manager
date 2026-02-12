import express from "express";
import LaundryRequest from "../models/LaundryRequest.js";
import MachineStats from "../models/MachineStats.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LAUNDRY_PATH = path.join(__dirname, "..", "laundry.json");

function readLaundry() {
  try {
    const raw = fs.readFileSync(LAUNDRY_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return { requests: [] };
  }
}

function writeLaundry(data) {
  try {
    fs.writeFileSync(LAUNDRY_PATH, JSON.stringify(data, null, 2));
  } catch { /* ignore */ }
}

const router = express.Router();


// STUDENT — GET requests
router.get("/student/:email", async (req, res) => {
  try {
    const requests = await LaundryRequest.find({
      studentEmail: req.params.email,
    }).sort({ createdAt: -1 });

    res.json({ requests });
  } catch (err) {
    const data = readLaundry();
    const requests = data.requests
      .filter(r => r.studentEmail === req.params.email)
      .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ requests });
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
    const { studentEmail, type, instructions } = req.body;
    const data = readLaundry();
    const request = {
      id: Date.now().toString(),
      studentEmail,
      type,
      instructions,
      status: "Pending",
      createdAt: new Date().toISOString()
    };
    data.requests.unshift(request);
    writeLaundry(data);
    res.status(201).json({ request });
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
    const data = readLaundry();
    const idx = data.requests.findIndex(r => r.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: "Not found" });
    if (data.requests[idx].status !== "Pending")
      return res.status(400).json({ message: "Can only cancel pending requests" });
    data.requests.splice(idx, 1);
    writeLaundry(data);
    res.json({ message: "Cancelled" });
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
    const { status, pickupDate } = req.body;
    const data = readLaundry();
    const idx = data.requests.findIndex(r => r.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: "Not found" });
    if (status) data.requests[idx].status = status;
    if (pickupDate) data.requests[idx].pickupDate = pickupDate;
    writeLaundry(data);
    res.json({ request: data.requests[idx] });
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

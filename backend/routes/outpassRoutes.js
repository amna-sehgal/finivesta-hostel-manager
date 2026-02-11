import express from "express";
import {
  createOutpassRequest,
  getStudentOutpasses,
  getPendingOutpasses,
  updateOutpassStatus,
} from "../controllers/outpassController.js";

const router = express.Router();

/* ================= STUDENT ================= */
router.post("/student/request", createOutpassRequest);
router.get("/student/:email", getStudentOutpasses);

/* ================= WARDEN ================= */
router.get("/warden/pending", getPendingOutpasses);
router.patch("/warden/update/:id", updateOutpassStatus);

export default router;

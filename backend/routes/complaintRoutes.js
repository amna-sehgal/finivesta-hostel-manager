import express from "express";
import {
  createComplaint,
  getStudentComplaints,
  getAllComplaints,
  updateComplaintStatus,
  getActiveCount,
  deleteComplaint
} from "../controllers/complaintController.js";

const router = express.Router();

/* STUDENT */
router.post("/student", createComplaint);
router.get("/student/:email", getStudentComplaints);
router.delete("/student/:id", deleteComplaint);

/* WARDEN */
router.get("/warden", getAllComplaints);
router.patch("/warden/:id", updateComplaintStatus);
router.get("/warden/active-count", getActiveCount);

export default router;

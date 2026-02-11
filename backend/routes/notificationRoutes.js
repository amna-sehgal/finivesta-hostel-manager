import express from "express";
import {
  createNotification,
  getStudentNotifications,
  getWardenNotifications,
  deleteNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

router.post("/warden", createNotification);
router.get("/student/:email", getStudentNotifications);
router.get("/warden", getWardenNotifications);
router.delete("/warden/:id", deleteNotification);

export default router;

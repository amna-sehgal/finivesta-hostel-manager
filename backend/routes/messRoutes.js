import express from "express";
import {
  getStudentMess,
  submitFeedback,
  getWardenData,
  updateMenu,
  resetToday,
  updatePoll,
} from "../controllers/messController.js";

const router = express.Router();

router.get("/student", getStudentMess);
router.post("/student/feedback", submitFeedback);

router.get("/warden", getWardenData);
router.post("/warden/menu", updateMenu);
router.post("/warden/reset", resetToday);
router.post("/warden/poll", updatePoll);

export default router;

import express from "express";
import {
  createSOS,
  getAllSOS,
  getActiveSOS,
  resolveSOS,
} from "../controllers/sosController.js";

const router = express.Router();

router.post("/", createSOS);
router.get("/", getAllSOS);
router.get("/active", getActiveSOS);
router.patch("/:id", resolveSOS);

export default router;

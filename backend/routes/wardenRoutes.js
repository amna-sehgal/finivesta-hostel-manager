import express from "express";
import { wardenSignup, wardenLogin } from "../controllers/wardenAuthController.js";

const router = express.Router();

router.post("/signup", wardenSignup);
router.post("/login", wardenLogin);

export default router;


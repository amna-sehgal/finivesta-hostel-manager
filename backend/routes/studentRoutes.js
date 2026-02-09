import express from "express";
import { studentSignup, studentLogin, updateStudent } from "../controllers/studentAuthController.js";
import protect from "../middleware/protect.js";
import allowRoles from "../middleware/role.js";

const router = express.Router();

router.post("/signup", studentSignup);
router.post("/login", studentLogin);

// router.patch("/update", protect, allowRoles("student"), updateStudent);
router.patch("/update", (req,res,next)=>{
  console.log("UPDATE ROUTE HIT");
  next();
}, protect, allowRoles("student"), updateStudent);


export default router;


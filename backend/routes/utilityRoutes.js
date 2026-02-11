import express from "express";
import {
  getRoomBills,
  getRoommates,
  addBill,
  deleteBill,
} from "../controllers/utilityController.js";

const router = express.Router();

router.get("/:roomId", getRoomBills);
router.get("/roommates/:roomId", getRoommates);
router.post("/:roomId/add", addBill);
router.delete("/:roomId/:billId", deleteBill);

export default router;

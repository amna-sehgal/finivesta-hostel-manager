import express from "express";
import {
  getExpenses,
  setBudget,
  addExpense,
  deleteExpense,
} from "../controllers/expenseController.js";

const router = express.Router();

router.get("/:studentId", getExpenses);
router.post("/:studentId/budget", setBudget);
router.post("/:studentId/add", addExpense);
router.delete("/:studentId/:expenseId", deleteExpense);

export default router;

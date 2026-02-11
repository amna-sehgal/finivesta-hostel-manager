import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  monthlyBudget: { type: Number, default: 0 },
  expenses: [
    {
      amount: { type: Number, required: true },
      category: { type: String, required: true },
      note: { type: String, default: "" },
      date: { type: Date, required: true },
    },
  ],
});

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;

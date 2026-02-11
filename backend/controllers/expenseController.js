import Expense from "../models/Expense.js";

/* ---------- GET expenses ---------- */
export const getExpenses = async (req, res) => {
  const { studentId } = req.params;
  try {
    let studentExpenses = await Expense.findOne({ studentId });
    if (!studentExpenses) {
      studentExpenses = new Expense({ studentId });
      await studentExpenses.save();
    }
    res.json(studentExpenses);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

/* ---------- SET monthly budget ---------- */
export const setBudget = async (req, res) => {
  const { studentId } = req.params;
  const { monthlyBudget } = req.body;
  try {
    let studentExpenses = await Expense.findOne({ studentId });
    if (!studentExpenses) {
      studentExpenses = new Expense({ studentId, monthlyBudget });
    } else {
      studentExpenses.monthlyBudget = monthlyBudget;
    }
    await studentExpenses.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

/* ---------- ADD expense ---------- */
export const addExpense = async (req, res) => {
  const { studentId } = req.params;
  const { amount, category, note, date } = req.body;

  try {
    let studentExpenses = await Expense.findOne({ studentId });
    if (!studentExpenses) {
      studentExpenses = new Expense({ studentId });
    }

    const newExpense = { amount, category, note, date };
    studentExpenses.expenses.push(newExpense);
    await studentExpenses.save();

    res.json(newExpense);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

/* ---------- DELETE expense ---------- */
export const deleteExpense = async (req, res) => {
  const { studentId, expenseId } = req.params;

  try {
    const studentExpenses = await Expense.findOne({ studentId });
    if (!studentExpenses)
      return res.status(404).json({ error: "Student not found" });

    studentExpenses.expenses = studentExpenses.expenses.filter(
      (e) => e._id.toString() !== expenseId
    );
    await studentExpenses.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

import React, { useState, useEffect } from "react";
import "./expenses.css";
import Navbar from "../../components/common/sNavbar";
import { GiWallet } from "react-icons/gi";

const categories = [
  "Food",
  "Laundry",
  "Travel",
  "Utilities",
  "Personal",
  "Academics",
  "Others",
];

const BASE_URL = "http://localhost:5000";

const Expenses = () => {
  const student = JSON.parse(localStorage.getItem("student"));
  const studentId = student?.email; // 🔑 student-specific key

  const [budget, setBudget] = useState(0);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [expenses, setExpenses] = useState([]);

  /* ---------- CALCULATE SPENT AND REMAINING ---------- */
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = budget - totalSpent;

  /* ---------- CALCULATE DAYS LEFT AND DAILY BUDGET ---------- */
  const today = new Date();
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const daysLeft = lastDayOfMonth.getDate() - today.getDate() + 1; // +1 includes today
  const dailyBudget = remaining > 0 ? (remaining / daysLeft).toFixed(2) : 0;

  /* ---------- LOAD DATA FOR SPECIFIC STUDENT ---------- */
  useEffect(() => {
    if (!studentId) return;

    fetch(`${BASE_URL}/api/expenses/${studentId}`)
      .then((res) => res.json())
      .then((data) => {
        setBudget(data.monthlyBudget || 0);
        setExpenses(data.expenses || []);
      })
      .catch((err) => console.error("Expense load error", err));
  }, [studentId]);

  /* ---------- SAVE BUDGET FOR SPECIFIC STUDENT ---------- */
  const handleBudgetChange = async (value) => {
    const newBudget = Number(value);
    setBudget(newBudget);

    try {
      await fetch(`${BASE_URL}/api/expenses/${studentId}/budget`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ monthlyBudget: newBudget }),
      });
    } catch (err) {
      console.error("Budget save error", err);
    }
  };

  /* ---------- ADD EXPENSE FOR SPECIFIC STUDENT ---------- */
  const handleAddExpense = async () => {
    if (!amount || !category) return;

    const expenseData = {
      amount: Number(amount),
      category,
      note,
      date: new Date().toISOString(),
    };

    try {
      const res = await fetch(`${BASE_URL}/api/expenses/${studentId}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expenseData),
      });

      const savedExpense = await res.json();
      setExpenses([...expenses, savedExpense]);

      setAmount("");
      setCategory("");
      setNote("");
    } catch (err) {
      console.error("Add expense error", err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="expenses-container">
        <div className="expense-header">
          <GiWallet className="expense-icon" />
          <div>
            <h1>My Expenses</h1>
            <p className="subtitle">
              Track your hostel spending & stay within budget
            </p>
          </div>
        </div>

        {/* Monthly Budget */}
        <section className="card">
          <h2>Monthly Budget Planner</h2>
          <p className="helper-text">
            Set a budget for this month and track how much you spend.
          </p>

          <input
            className="budget-input"
            type="number"
            placeholder="Enter monthly budget (₹)"
            value={budget || ""}
            onChange={(e) => handleBudgetChange(e.target.value)}
          />

          <div className="budget-stats">
            <span>Spent: ₹{totalSpent}</span>
            <span>Remaining: ₹{remaining}</span>
            <span className="days-left">Days left: {daysLeft}</span>
            <span className="daily-budget">
              Suggested/day: ₹{dailyBudget}
            </span>
          </div>

          <div className="progress-bar">
            <div
              className="progress"
              style={{
                width:
                  budget > 0
                    ? `${Math.min((totalSpent / budget) * 100, 100)}%`
                    : "0%",
                background:
                  remaining <= 0
                    ? "#ef4444"
                    : "linear-gradient(90deg, #34d399, #10b981)",
              }}
            ></div>
          </div>

          {budget > 0 && remaining <= 0 && (
            <p className="overspent-text">You have exhausted your budget!</p>
          )}
        </section>

        {/* Add Expense */}
        <section className="card">
          <h2>Add a New Expense</h2>

          <div className="form-grid">
            <input
              type="number"
              placeholder="Enter amount (₹)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={budget > 0 && remaining <= 0} />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={budget > 0 && remaining <= 0}            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Optional note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={budget > 0 && remaining <= 0} />
          </div>

          <button
            onClick={handleAddExpense}
            disabled={budget > 0 && remaining <= 0}
          >

            Add Expense
          </button>
        </section>

        {/* Expense List */}
        <section className="card">
          <h2>Where your money goes</h2>

          {expenses.length === 0 ? (
            <p className="empty-text">No expenses added yet</p>
          ) : (
            <ul className="expense-list">
              {expenses.map((e) => (
                <li key={e.id}>
                  <span>{e.category}</span>
                  <span>₹{e.amount}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
};

export default Expenses;



import React, { useEffect, useState } from "react";
import styles from "./utilities.module.css";  // NEW expenses-style CSS below
import Navbar from "../../components/common/sNavbar";
import { MdElectricalServices } from "react-icons/md";

const Utilities = () => {
  // YOUR EXACT SAME CODE - NO CHANGES
  const student = JSON.parse(localStorage.getItem("student"));
  const studentId = student?.email;
  const roomId = student?.roomno;

  const [roommates, setRoommates] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [selected, setSelected] = useState([]);
  const [bills, setBills] = useState([]);

  // ALL useEffects, handlers SAME AS BEFORE...
  useEffect(() => {
    if (!roomId) return;
    fetch(`http://localhost:5000/api/utilities/roommates/${roomId}`)
      .then(res => res.json())
      .then(data => {
        setRoommates(data.roommates);
        setSelected(data.roommates.map(r => r.email));
      })
      .catch(err => console.error("Error fetching roommates:", err));
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;
    fetch(`http://localhost:5000/api/utilities/${roomId}`)
      .then((res) => res.json())
      .then((data) => setBills(data))
      .catch((err) => console.error(err));
  }, [roomId]);

  const toggleParticipant = (email) => {
    setSelected((prev) =>
      prev.includes(email)
        ? prev.filter((e) => e !== email)
        : [...prev, email]
    );
  };

  const handleAddBill = async () => {
    if (!title || !amount || selected.length === 0) return;
    const payload = {
      title,
      totalAmount: Number(amount),
      paidBy: studentId,
      participants: selected,
    };
    try {
      const res = await fetch(
        `http://localhost:5000/api/utilities/${roomId}/add`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const newBill = await res.json();
      setBills((prev) => [...prev, newBill]);
      setTitle("");
      setAmount("");
      setSelected(roommates.map(r => r.email));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBill = async (billId) => {
    try {
      await fetch(`http://localhost:5000/api/utilities/${roomId}/${billId}`, {
        method: "DELETE",
      });
      setBills((prev) => prev.filter((bill) => bill._id !== billId));
    } catch (err) {
      console.error(err);
    }
  };

  let youOwe = 0;
  let youGet = 0;
  bills.forEach((bill) => {
    if (!bill.participants.includes(studentId)) return;
    if (bill.paidBy === studentId) {
      youGet += bill.splitAmount * (bill.participants.length - 1);
    } else {
      youOwe += bill.splitAmount;
    }
  });

  return (
    <>
      <Navbar />
      <div className={styles.utilitiesContainer}>
        {/* HEADER - Expenses style */}
        <div className={styles.utilityHeader}>
          <MdElectricalServices className={styles.utilityIcon} />
          <div>
            <h1>Shared Utilities</h1>
            <p className={styles.subtitle}>Split hostel bills & track balances</p>
          </div>
        </div>

        {/* BALANCE STATS */}
        <section className={styles.card}>
          <div className={styles.utilityStats}>
            <span className={styles.owe}>You owe: ₹{youOwe.toFixed(2)}</span>
            <span className={styles.get}>You'll get: ₹{youGet.toFixed(2)}</span>
          </div>
        </section>

        {/* ADD BILL FORM */}
        <section className={styles.card}>
          <h2>Add Utility Bill</h2>
          <div className={styles.formGrid}>
            <input
              type="text"
              placeholder="Electricity, WiFi, Water..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.budgetInput}
            />
            <input
              type="number"
              placeholder="Total amount (₹)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={styles.budgetInput}
            />
          </div>

          <p className={styles.helperText}>Split equally among:</p>
          <div className={styles.checkboxGrid}>
            {roommates.map((r) => (
              <label key={r.email} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={selected.includes(r.email)}
                  onChange={() => toggleParticipant(r.email)}
                />
                {r.name}
              </label>
            ))}
          </div>

          <button onClick={handleAddBill} className={styles.billButton}>
            Add Bill
          </button>
        </section>

        {/* BILLS LIST */}
        <section className={styles.card}>
          <h2>Utility Bills ({bills.length})</h2>
          {bills.length === 0 ? (
            <p className={styles.emptyText}>No utility bills added yet</p>
          ) : (
            <ul className={styles.expenseList}>
              {bills.map((bill) => (
                <li key={bill._id} className={styles.utilityBill}>
                  <div>
                    <strong>{bill.title}</strong>
                    <p>₹{bill.totalAmount} • ₹{bill.splitAmount.toFixed(2)} each</p>
                  </div>
                  <div>
                    <span className={styles.payer}>
                      {bill.paidBy === studentId ? "You" : bill.paidBy}
                    </span>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteBill(bill._id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
};

export default Utilities;

import React, { useEffect, useState } from "react";
import "./utilities.css";
import Navbar from "../../components/common/sNavbar";
import { MdElectricalServices } from "react-icons/md";

const Utilities = () => {
  const student = JSON.parse(localStorage.getItem("student"));
  const studentId = student?.email;
  const roomId = student?.roomno;

  const [roommates, setRoommates] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [selected, setSelected] = useState([]); // everyone selected for split
  const [bills, setBills] = useState([]);

  /* ---------- FETCH ROOMMATES ---------- */
  useEffect(() => {
    if (!roomId) return;

    fetch(`http://localhost:5000/api/utilities/roommates/${roomId}`)
      .then(res => res.json())
      .then(data => {
        setRoommates(data.roommates);
        // default selected: include self
        setSelected(data.roommates.map(r => r.email));
      })
      .catch(err => console.error("Error fetching roommates:", err));
  }, [roomId]);

  /* ---------- FETCH BILLS ON LOAD ---------- */
  useEffect(() => {
    if (!roomId) return;

    fetch(`http://localhost:5000/api/utilities/${roomId}`)
      .then((res) => res.json())
      .then((data) => setBills(data))
      .catch((err) => console.error(err));
  }, [roomId]);

  /* ---------- TOGGLE PARTICIPANT ---------- */
  const toggleParticipant = (email) => {
    setSelected((prev) =>
      prev.includes(email)
        ? prev.filter((e) => e !== email)
        : [...prev, email]
    );
  };

  /* ---------- ADD BILL ---------- */
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

      // Reset form
      setTitle("");
      setAmount("");
      setSelected(roommates.map(r => r.email)); // reset selection
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------- DELETE BILL ---------- */
  const handleDeleteBill = async (billId) => {
    try {
      await fetch(`http://localhost:5000/api/utilities/${roomId}/${billId}`, {
        method: "DELETE",
      });
      setBills((prev) => prev.filter((bill) => bill.id !== billId));
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------- BALANCE CALC ---------- */
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
      <div className="utilities-container">
        <div className="utility-header">
          <MdElectricalServices className="utility-icon" />
          <div>
            <h1>Shared Utilities</h1>
            <p className="subtitle">
              Split common hostel bills & track balances
            </p>
          </div>
        </div>

        {/* Overview */}
        <section className="card">
          <div className="utility-stats">
            <span className="owe">You owe: ₹{youOwe.toFixed(2)}</span>
            <span className="get">You’ll get: ₹{youGet.toFixed(2)}</span>
          </div>
        </section>

        {/* Add Bill */}
        <section className="card">
          <h2>Add Utility Bill</h2>

          <div className="form-grid">
            <input
              type="text"
              placeholder="Utility name (Electricity, WiFi)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="number"
              placeholder="Total amount (₹)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <p className="helper-text">Split equally among:</p>
          <div className="checkbox-grid">
            {roommates.map((r) => (
              <label key={r.email}>
                <input
                  type="checkbox"
                  checked={selected.includes(r.email)}
                  onChange={() => toggleParticipant(r.email)}
                />
                {r.name}
              </label>
            ))}
          </div>

          <button onClick={handleAddBill} className="bill-btn">
            Add Bill
          </button>
        </section>

        {/* Bills List */}
        <section className="card">
          <h2>Utility Bills</h2>
          {bills.length === 0 ? (
            <p className="empty-text">No utility bills added yet</p>
          ) : (
            bills.map((bill) => (
              <div key={bill.id} className="utility-bill">
                <div>
                  <strong>{bill.title}</strong>
                  <p>
                    ₹{bill.totalAmount} · ₹{bill.splitAmount.toFixed(2)} each
                  </p>
                </div>
                <span className="payer">
                  Paid by {bill.paidBy === studentId ? "You" : bill.paidBy}
                </span>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteBill(bill.id)}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </section>
      </div>
    </>
  );
};

export default Utilities;

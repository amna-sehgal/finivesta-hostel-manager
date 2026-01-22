import Navbar from "../../components/common/Navbar";
import { useState } from "react";
import {
  GiWashingMachine,
  GiClothes,
  GiWaterDrop,
  GiCheckMark,
} from "react-icons/gi";
import {
  HiOutlineArchiveBox,
  HiOutlineTruck,
  HiOutlineCalendarDays,
} from "react-icons/hi2";
import { FaTruck, FaCalendarAlt } from "react-icons/fa";
import "./Laundry.css";

function Laundry() {
  const [selectedType, setSelectedType] = useState(null);

  const clothTypes = [
    { label: "Regular Clothes", icon: <GiClothes /> },
    { label: "Delicates", icon: <GiWaterDrop /> },
    { label: "Bedsheets", icon: <GiCheckMark /> },
  ];

  return (
    <>
      <Navbar />

      <div className="laundry-root">
        {/* HEADER */}
        <div className="laundry-header">
          <GiWashingMachine className="laundry-icon" />
          <div>
            <h1>Laundry Services</h1>
            <p>Schedule, track & manage your laundry easily</p>
          </div>
        </div>

        {/* STATUS STRIP */}
        <div className="laundry-status">
          <div className="status-item">
            <HiOutlineArchiveBox />
            <span>Pending Bags</span>
            <strong>1</strong>
          </div>

          <div className="status-item">
            <HiOutlineTruck />
            <span>Processing</span>
            <strong>Yes</strong>
          </div>

          <div className="status-item">
            <HiOutlineCalendarDays />
            <span>Next Pickup</span>
            <strong>Tomorrow</strong>
          </div>
        </div>

        {/* SCHEDULE */}
        <div className="glass laundry-schedule">
          <h2>
            <FaCalendarAlt /> Weekly Schedule
          </h2>

          <div className="schedule-row">
            <div>
              <span>Pickup Days</span>
              <strong>Mon • Thu</strong>
            </div>
            <div>
              <span>Delivery</span>
              <strong>Within 48 hrs</strong>
            </div>
            <div>
              <span>Pickup Time</span>
              <strong>8–10 AM</strong>
            </div>
          </div>
        </div>

        {/* REQUEST */}
        <div className="glass laundry-request">
          <h2>Request Laundry Pickup</h2>

          <div className="cloth-types">
            {clothTypes.map((item) => (
              <button
                key={item.label}
                className={`cloth-chip ${
                  selectedType === item.label ? "active" : ""
                }`}
                onClick={() =>
                  setSelectedType(
                    selectedType === item.label ? null : item.label
                  )
                }
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          <textarea
            placeholder="Any special instructions? (optional)"
            className="laundry-input"
          />

          <button className="pickup-btn">
            <FaTruck /> Schedule Pickup
          </button>
        </div>

        {/* ACTIVE REQUESTS */}
        <div className="laundry-active">
          <h2>Active Requests</h2>

          <div className="laundry-cards">
            <div className="glass laundry-card">
              <h3>Regular Clothes</h3>
              <p>Pickup: 22 Jan</p>
              <span className="status processing">Processing</span>
            </div>

            <div className="glass laundry-card">
              <h3>Bedsheets</h3>
              <p>Pickup: 18 Jan</p>
              <span className="status delivered">Delivered</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Laundry;

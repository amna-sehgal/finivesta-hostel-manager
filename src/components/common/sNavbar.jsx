import { NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdReportProblem,
  MdFoodBank,
  MdLocalLaundryService,
} from "react-icons/md";
import { FaIdCard, FaUserCircle } from "react-icons/fa";
import { GiNotebook } from "react-icons/gi";
import { MdCampaign } from "react-icons/md";
import { MdNotifications } from "react-icons/md";
import { MdAccountBalanceWallet } from "react-icons/md";


import "./sNavbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      {/* Left */}
      <NavLink to="/" className="icon">
        <div className="nav-logo">
          StayMate
        </div>
      </NavLink>

      {/* Center */}
      <div className="nav-links">
        <NavLink to="/student/dashboard">
          <MdDashboard />
          Dashboard
        </NavLink>

        {/* Replacing Complaints with two separate links */}
        <NavLink to="/student/notices">
          <MdCampaign />
          Notices
        </NavLink>

        <NavLink to="/student/mess">
          <MdFoodBank />
          Mess
        </NavLink>

        <NavLink to="/student/laundry">
          <MdLocalLaundryService />
          Laundry
        </NavLink>

        <NavLink to="/student/expenses">
          <MdAccountBalanceWallet />
          Expenses
        </NavLink>
      </div>

      {/* Right */}
      <NavLink to="/student/Sprofile" className="icon">
        <div className="nav-profile">
          <FaUserCircle size={28} />
        </div>
      </NavLink>
    </nav>
  );
}

export default Navbar;

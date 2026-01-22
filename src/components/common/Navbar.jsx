import { NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdReportProblem,
  MdFoodBank,
  MdLocalLaundryService,
} from "react-icons/md";
import { FaIdCard, FaUserCircle } from "react-icons/fa";
import { GiNotebook } from "react-icons/gi";

import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      {/* Left */}
      <div className="nav-logo">
        StayMate
      </div>

      {/* Center */}
      <div className="nav-links">
        <NavLink to="/student/dashboard">
          <MdDashboard />
          Dashboard
        </NavLink>

        {/* Replacing Complaints with two separate links */}
        <NavLink to="/student/raise-complaint">
          <MdReportProblem />
          Raise Complaint
        </NavLink>

        <NavLink to="/student/my-complaints">
          <GiNotebook />
          My Complaints
        </NavLink>

        <NavLink to="/student/outpass">
          <FaIdCard />
          Outpass
        </NavLink>

        <NavLink to="/student/mess">
          <MdFoodBank />
          Mess
        </NavLink>

        <NavLink to="/student/laundry">
          <MdLocalLaundryService />
          Laundry
        </NavLink>
      </div>

      {/* Right */}
      <div className="nav-profile">
        <FaUserCircle size={28} />
      </div>
    </nav>
  );
}

export default Navbar;

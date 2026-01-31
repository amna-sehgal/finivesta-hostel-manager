import { BrowserRouter, Routes, Route } from "react-router-dom";

// ---------------- Public Pages ----------------
import Home from "./pages/public/Home";

// ---------------- Student Pages ----------------
import Dashboard from "./pages/student/Dashboard";
import RaiseComplaint from "./pages/student/RaiseComplaint";
import MyComplaints from "./pages/student/MyComplaints";
import Outpass from "./pages/student/Outpass";
import Mess from "./pages/student/Mess";
import Laundry from "./pages/student/Laundry";
import Login from "./pages/student/Login";
import Signup from "./pages/student/Signup";
import Sprofile from "./pages/student/Sprofile";
import Notices from "./pages/student/Notices";
import Utilities from "./pages/student/Utilities";
import EmergencySOS from "./pages/student/Emergency";
// ---------------- Warden Pages (Lazy) ----------------
import { lazy, Suspense } from "react";
import Expenses from "./pages/student/Expenses";

// Lazy load warden components
const WardenDashboard = lazy(() => import("./pages/warden/wdashboard"));
const Approval = lazy(() => import("./pages/warden/dropdown/approval"));
const Complaint = lazy(() => import("./pages/warden/dropdown/complaint"));
const WardenMess = lazy(() => import("./pages/warden/dropdown/wmess"));
const WardenLaundry = lazy(() => import("./pages/warden/dropdown/wlaundry"));
const Profile = lazy(() => import("./pages/warden/wprofile"));
const Notification = lazy(() => import("./pages/warden/notification"));
const LoginWarden = lazy(() => import("./pages/warden/wlogin"));
const RegisterWarden = lazy(() => import("./pages/warden/register"));
const Safety = lazy(() => import("./pages/warden/dropdown/safety"));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ---------------- Public Routes ---------------- */}
        <Route path="/" element={<Home />} />

        {/* ---------------- Student Routes ---------------- */}
        <Route path="/student/dashboard" element={<Dashboard />} />
        <Route path="/student/raise-complaint" element={<RaiseComplaint />} />
        <Route path="/student/my-complaints" element={<MyComplaints />} />
        <Route path="/student/outpass" element={<Outpass />} />
        <Route path="/student/mess" element={<Mess />} />
        <Route path="/student/laundry" element={<Laundry />} />
        <Route path="/student/login" element={<Login />} />
        <Route path="/student/signup" element={<Signup />} />
        <Route path='/student/Sprofile' element={<Sprofile />} />
        <Route path= '/student/Notices' element={<Notices />} />
        <Route path= '/student/expenses' element={<Expenses />} />
        <Route path= '/student/utilities' element={<Utilities />} />

        {/* ---------------- Warden Routes ---------------- */}
        <Route
          path="/warden/dashboard"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <WardenDashboard />
            </Suspense>
          }
        />
        <Route
          path="/warden/approval"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Approval />
            </Suspense>
          }
        />
        <Route
          path="/warden/complaint"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Complaint />
            </Suspense>
          }
        />
        <Route
          path="/warden/mess"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <WardenMess />
            </Suspense>
          }
        />
        <Route
          path="/warden/laundry"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <WardenLaundry />
            </Suspense>
          }
        />
        <Route
          path="/warden/profile"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Profile />
            </Suspense>
          }
        />
        <Route
          path="/warden/notification"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Notification />
            </Suspense>
          }
        />
        <Route
          path="/warden/login"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <LoginWarden />
            </Suspense>
          }
        />
        <Route
          path="/warden/register"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <RegisterWarden />
            </Suspense>
          }
        />
        <Route
          path="/warden/safety"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Safety />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;




import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/public/Home";
import Dashboard from "./pages/student/Dashboard";
import RaiseComplaint from "./pages/student/RaiseComplaint";
import MyComplaints from "./pages/student/MyComplaints";
import Outpass from "./pages/student/Outpass";
import Mess from "./pages/student/Mess";
import Laundry from "./pages/student/Laundry";
import Login from "./pages/student/Login";
import Signup from "./pages/student/Signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/student/dashboard" element={<Dashboard />} />
        <Route path="/student/raise-complaint" element={<RaiseComplaint />} />
        <Route path="/student/my-complaints" element={<MyComplaints/>} />
        <Route path="/student/outpass" element={<Outpass />} /> 
        <Route path="/student/mess" element={<Mess />} />
        <Route path="/student/laundry" element={<Laundry />} />
        <Route path="/student/login" element={<Login />} />
        <Route path="/student/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

import Navbar from './warden-dashboard/navbar.jsx';
import Dashboard from './warden-dashboard/dashboard.jsx';
import Mess from './warden-dashboard/dropdown/mess.jsx';
import Laundry from './warden-dashboard/dropdown/laundry.jsx';
import Complaint from './warden-dashboard/dropdown/complaint.jsx';
import Approval from './warden-dashboard/dropdown/approval.jsx';

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

createRoot(document.getElementById('root')).render(
 <BrowserRouter>
  <Routes>
    <Route element={<Layout />}>
      <Route path="/" element={<Dashboard />} />
      <Route path="/warden-dashboard/dropdown/mess" element={<Mess />} />
      <Route path="/warden-dashboard/dropdown/laundry" element={<Laundry />} />
      <Route path="/warden-dashboard/dropdown/complaint" element={<Complaint />} />
      <Route path="/warden-dashboard/dropdown/approval" element={<Approval />} />
    </Route>
  </Routes>
</BrowserRouter>

);


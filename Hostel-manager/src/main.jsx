import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

import Navbar from '../../src/pages/warden/wnavbar.jsx';
import Dashboard from '../../src/pages/warden/wdashboard.jsx';
import Mess from '../../src/pages/warden/dropdown/wmess.jsx';
import Laundry from '../../src/pages/warden/dropdown/wlaundry.jsx';
import Complaint from '../../src/pages/warden/dropdown/complaint.js';
import Approval from '../../src/pages/warden/dropdown/approval.js';
import Notification from '../../src/pages/warden/notification.jsx'; 
import Profile from '../../src/pages/warden/wprofile.jsx';

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
      <Route path="/warden-dashboard/notification" element={<Notification />} />
      <Route path="/warden-dashboard/profile" element={<Profile />} />
    </Route>
  </Routes>
</BrowserRouter>

);


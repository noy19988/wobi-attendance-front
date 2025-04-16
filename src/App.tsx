import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminLayout from "./pages/AdminLayout";
import AdminShiftHistory from "./components/AdminShiftHistory";
import CreateUserPage from "./components/CreateDeleteUsersPage.js";
import ManageUsersPage from "./components/ManageUsersShiftsPage.js";
import UserLayout from "./pages/UserLayout";
import UserDashboard from "./pages/Dashboard.js";
import UserShiftHistory from "./components/UsersShiftHistory.js";
import ProfileDetails from "./components/ProfileDetails.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<UserDashboard />} />
          <Route path="history" element={<AdminShiftHistory />} />
          <Route path="profile" element={<ProfileDetails />} />
          <Route path="users" element={<ManageUsersPage />} /> {/* ✅ */}
          <Route path="create-user" element={<CreateUserPage />} />
        </Route>

        {}
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<UserDashboard />} />
          <Route path="history" element={<UserShiftHistory />} />
          <Route path="profile" element={<ProfileDetails />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
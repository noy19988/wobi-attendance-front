import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminLayout from "./pages/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminShiftHistory from "./components/AdminShiftHistory";
import CreateUserPage from "./components/CreateUserPage";
import ManageUsersPage from "./components/ManageUsersPage";
import UserLayout from "./pages/UserLayout";
import UserDashboard from "./pages/UserDashboard";
import UserHistory from "./components/UserHistory";
import UserProfile from "./components/UserProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="history" element={<AdminShiftHistory />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="users" element={<ManageUsersPage />} /> {/* ✅ */}
          <Route path="create-user" element={<CreateUserPage />} />
        </Route>

        {}
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<UserDashboard />} />
          <Route path="history" element={<UserHistory />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
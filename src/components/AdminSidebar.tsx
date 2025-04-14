import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  UserPlus,
  CalendarClock,
  Clock,
  UserRound,
  Users,
} from "lucide-react";
import "../style/wobi-sidebar.css";

const AdminSidebar = () => {
  return (
    <aside className="wobi-sidebar">
      <div className="wobi-sidebar-logo">
        <CalendarClock size={28} />
        <span>TimeTracker</span>
      </div>

      <nav className="wobi-sidebar-nav">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `wobi-sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin/history"
          className={({ isActive }) =>
            `wobi-sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <Clock size={20} />
          <span>Shift History</span>
        </NavLink>

        <NavLink
          to="/admin/profile"
          className={({ isActive }) =>
            `wobi-sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <UserRound size={20} />
          <span>Admin Details</span>
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `wobi-sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <Users size={20} />
          <span>Manage Users</span>
        </NavLink>

        <NavLink
          to="/admin/create-user"
          className={({ isActive }) =>
            `wobi-sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <UserPlus size={20} />
          <span>Create New User</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;

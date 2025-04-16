import { NavLink } from "react-router-dom";
import {
  RefreshCcw,
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
        <span>ShiftTracker</span>
      </div>

      <nav className="wobi-sidebar-nav">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `wobi-sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <RefreshCcw size={20} />
          <span>Shift Entry & Exit</span>
        </NavLink>

        <NavLink
          to="/admin/history"
          className={({ isActive }) =>
            `wobi-sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <Clock size={20} />
          <span>Admin Shifts History</span>
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
          <span>Manage Users Shifts</span>
        </NavLink>

        <NavLink
          to="/admin/create-user"
          className={({ isActive }) =>
            `wobi-sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <UserPlus size={18.9} />
          <span>Create & Delete User</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;

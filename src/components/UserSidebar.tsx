import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Clock,
  UserRound,
  CalendarClock,
} from "lucide-react";
import "../style/wobi-sidebar.css";

const Sidebar = () => {
  return (
    <aside className="wobi-sidebar">
      <div className="wobi-sidebar-logo">
        <CalendarClock size={28} />
        <span>TimeTracker</span>
      </div>

      <nav className="wobi-sidebar-nav">
        <NavLink
          to="/user"
          end
          className={({ isActive }) =>
            `wobi-sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/user/history"
          className={({ isActive }) =>
            `wobi-sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <Clock size={20} />
          <span>Shift History</span>
        </NavLink>

        <NavLink
          to="/user/profile"
          className={({ isActive }) =>
            `wobi-sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <UserRound size={20} />
          <span>User Details</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;

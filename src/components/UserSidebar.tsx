import { NavLink } from "react-router-dom";
import {
  RefreshCcw,
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
        <span>ShiftTracker</span>
      </div>

      <nav className="wobi-sidebar-nav">
        <NavLink
          to="/user"
          end
          className={({ isActive }) =>
            `wobi-sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <RefreshCcw size={20} />
          <span>Shift Entry & Exit</span>
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

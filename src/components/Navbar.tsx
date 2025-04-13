import { useBerlinClock } from "../hooks/useBerlinClock";
import { LogOut, Clock, CircleUserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../style/navbar.css";

interface NavbarProps {
  username: string;
}

const Navbar: React.FC<NavbarProps> = ({ username }) => {
  const { berlinTime } = useBerlinClock();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <header className="wobi-navbar">
      {}
      <div className="wobi-navbar-user">
        <CircleUserRound className="wobi-navbar-icon" />
        <div>
          <p className="wobi-navbar-user-title">Hello, {username}</p>
          <p className="wobi-navbar-user-subtitle">
            Welcome to the Shift Management System
          </p>
        </div>
      </div>

      {}
      <div className="wobi-navbar-clock">
        <Clock className="wobi-navbar-icon" />
        <span className="wobi-navbar-clock-text">
          {berlinTime.date} • {berlinTime.time}
        </span>
        <span className="wobi-navbar-clock-badge">Germany (CET)</span>
      </div>

      {}
      <button onClick={handleLogout} className="wobi-navbar-logout">
        <LogOut size={18} />
        Logout
      </button>
    </header>
  );
};

export default Navbar;

import { useState, useEffect } from "react";
import { LogIn, LogOut, Clock } from "lucide-react";
import "../style/user-dashboard.css";
import { startShift, endShift, getCurrentShift } from "../api/attendanceApi.js";

const Dashboard = () => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [clockOutTime, setClockOutTime] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false); // 🔄 חדש

  useEffect(() => {
    const fetchShiftStatus = async () => {
      try {
        console.log("Fetching current shift...");
        const response = await getCurrentShift();
        console.log("Response from /attendance/current:", response);

        if (response.message === "Active shift found") {
          setIsClockedIn(true);
          setClockInTime(response.shift?.timestamp || null);
        } else {
          setIsClockedIn(false);
          setClockInTime(null);
        }
      } catch (error) {
        console.error("Failed to fetch current shift:", error);
        setIsClockedIn(false);
        setClockInTime(null);
      }
    };

    fetchShiftStatus();
  }, []);

  const handleClockIn = async () => {
    setIsProcessing(true);
    try {
      const response = await startShift();
      console.log("Shift started:", response);
      setClockInTime(response.record?.timestamp || null);
      setIsClockedIn(true);
    } catch (error) {
      console.error("Failed to start shift:", error);
      alert("Could not start shift. Please try again later.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClockOut = async () => {
    setIsProcessing(true);
    try {
      const response = await endShift();
      console.log("Shift ended:", response);
      setClockOutTime(response.record?.timestamp || null);
      setIsClockedIn(false);
    } catch (error) {
      console.error("Failed to end shift:", error);
      alert("Could not end shift. Please try again later.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="user-shift-container">
      <div className="user-shift-card">
        <div className="user-shift-header">
          <div>
            <h2 className="user-shift-title">Shift Status</h2>
            <p className="user-shift-subtitle">
              You are currently {isClockedIn ? "on shift" : "off shift"}
            </p>
          </div>
          <span className={`user-shift-badge ${isClockedIn ? "on" : "off"}`}>
            {isClockedIn ? "On Shift" : "Off Shift"}
          </span>
        </div>

        <div className="user-shift-timings">
          <div>
            <h4>Clock In</h4>
            <div className="user-shift-time">
              <Clock size={18} />
              <span>{clockInTime || "--:--:--"}</span>
            </div>
          </div>
          <div>
            <h4>Clock Out</h4>
            <div className="user-shift-time">
              <Clock size={18} />
              <span>{clockOutTime || "--:--:--"}</span>
            </div>
          </div>
        </div>

        <div className="user-shift-buttons">
          <button
            className="clock-btn clock-in"
            onClick={handleClockIn}
            disabled={isClockedIn || isProcessing}
          >
            <LogIn size={16} /> Start Shift
          </button>
          <button
            className="clock-btn clock-out"
            onClick={handleClockOut}
            disabled={!isClockedIn || isProcessing}
          >
            <LogOut size={16} /> End Shift
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

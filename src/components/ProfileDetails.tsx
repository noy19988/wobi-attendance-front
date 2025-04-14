import { useState, useEffect } from "react";
import axios from "axios";
import { User } from "../types/user.js";
import "../style/user-profile.css";

const ProfileDetails = () => {
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");
  const [userData, setUserData] = useState<Partial<User>>({});
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      console.log("Sending token:", token);  

      axios
        .get("http://localhost:3000/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log("User data received:", res.data); 
          setUserData(res.data as Partial<User>);
        })
        .catch((err) => {
          console.error("Failed to load user data:", err);  
          alert("Failed to load user data.");
        });
    }
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return alert("New password and confirmation do not match.");
    }

    try {
      const token = localStorage.getItem("token");
      console.log("Token for password update:", token);  

      await axios.put(
        "http://localhost:3000/auth/update-password",
        { currentPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Error updating password:", err);  
      alert("Failed to update password.");
    }
  };

  return (
    <div className="profile-container">
      {/* Tabs */}
      <div className="tabs-bar">
        <button
          onClick={() => setActiveTab("profile")}
          className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
        >
          👤 Profile Details
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={`tab-button ${activeTab === "password" ? "active" : ""}`}
        >
          🔒 Change Password
        </button>
      </div>

      {}
      {activeTab === "profile" && (
        <div className="card-box">
          <h2>Profile Details</h2>
          <p className="subtitle">View your account information</p>

          <div className="form-group">
            <label>ID</label>
            <input type="text" disabled value={userData.id || ""} />
          </div>

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              disabled
              value={`${userData.firstName || ""} ${userData.lastName || ""}`}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" disabled value={userData.email || ""} />
          </div>

          <div className="form-group">
            <label>Username</label>
            <input type="text" disabled value={userData.username || ""} />
          </div>

          <div className="form-group">
            <label>Role</label>
            <input type="text" disabled value={userData.role || ""} />
          </div>
        </div>
      )}

      {/* Password Change */}
      {activeTab === "password" && (
        <div className="card-box">
          <h2>Change Password</h2>
          <p className="subtitle">Update your password to keep your account secure</p>
          <form onSubmit={handlePasswordChange} className="user-profile-form">
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="save-btn">
              Update Password
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfileDetails;

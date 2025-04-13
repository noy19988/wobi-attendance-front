import { useState } from "react";
import "../style/wobi-profile.css";

interface UserDetailsProps {
  user: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  onUpdate: (email: string, currentPassword: string, newPassword: string) => void;
}

const UserDetails: React.FC<UserDetailsProps> = ({ user, onUpdate }) => {
  const [email, setEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(email, currentPassword, newPassword);
  };

  return (
    <div className="wobi-profile-card">
      <h2 className="wobi-profile-title">User Profile</h2>

      <div className="wobi-profile-info">
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>First Name:</strong> {user.firstName}</p>
        <p><strong>Last Name:</strong> {user.lastName}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>

      <form onSubmit={handleSubmit} className="wobi-profile-form">
        <div className="wobi-profile-form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="wobi-profile-form-group">
          <label>Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>

        <div className="wobi-profile-form-group">
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="wobi-profile-button">Update Details</button>
      </form>
    </div>
  );
};

export default UserDetails;

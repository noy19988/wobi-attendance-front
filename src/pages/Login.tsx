import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/authUserApi.js";
import { CalendarClock } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await loginUser(username, password);
      localStorage.setItem("token", res.token);
      localStorage.setItem("username", username);
      localStorage.setItem("role", res.role);

      if (res.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } catch (err) {
      console.error("Login failed:", err);
      alert("Invalid username or password.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 px-4">
      
      <div className="mb-10 text-center">
        <div className="flex items-center justify-center gap-2 text-blue-700">
          <CalendarClock size={36} />
          <h1 className="text-3xl font-bold">Welcome to ShiftTracker</h1>
        </div>
        <p className="mt-2 text-gray-600 text-sm">Employee Management System</p>
      </div>

      <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-xl">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Login to your account</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full rounded-lg border px-4 py-2 outline-none focus:border-blue-500 focus:ring"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border px-4 py-2 outline-none focus:border-blue-500 focus:ring"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

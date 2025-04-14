import Navbar from "../components/Navbar";
import Sidebar from "../components/UserSidebar.js";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

const UserLayout = () => {
  const [username, setUsername] = useState("user");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar username={username} />
        {}
        <main className="p-6 flex-1" style={{ backgroundColor: "#f7fbff" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;

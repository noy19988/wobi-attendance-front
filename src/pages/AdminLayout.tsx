import Navbar from "../components/Navbar";
import AdminSidebar from "../components/AdminSidebar";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

const AdminLayout = () => {
  const [username, setUsername] = useState("admin");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <Navbar username={username} />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

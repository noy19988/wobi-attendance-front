import { useState, useEffect } from "react";
import { deleteUser } from "../api/authUserApi.js"; 
import { getAllUsers } from "../api/attendanceApi.js"; 
import CustomDropdown from "../components/CustomDropdown";
const CreateDeleteUsersPage = () => {
  const [formData, setFormData] = useState({
    id: "",
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "user",
  });

  const [users, setUsers] = useState<{ id: string; fullName: string }[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token retrieved on page load:", token);  

    if (!token) {
      alert("Unauthorized access. Please login.");
      return;
    }

    const fetchUsers = async () => {
      try {
        const users = await getAllUsers();
        setUsers(users);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = localStorage.getItem("token");
    console.log("Token in localStorage:", token);
  
    if (!token) {
      alert("Unauthorized access. Please login.");
      console.log("Token not found in localStorage.");
      return;
    }
  
    console.log("Sending request with token:", token);
  
    try {
      const response = await fetch("http://localhost:3000/auth/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
    
      const data = await response.json();
      console.log("Response from create user:", data);
  
      if (response.ok) {
        alert("User created successfully!");
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      alert("An error occurred while creating the user.");
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUserId) return alert("Please select a user to delete.");

    const confirm = window.confirm("Are you sure you want to delete this user?");
    if (!confirm) return;

    try {
      await deleteUser(selectedUserId);
      alert("User deleted successfully.");
      setUsers((prev) => prev.filter((u) => u.id !== selectedUserId));
      setSelectedUserId("");
    } catch  {
      alert("Failed to delete user.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-start justify-center min-h-screen bg-blue-50 pt-2 gap-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-xl font-semibold text-center text-gray-800">Create New User</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label htmlFor="id" className="block text-sm font-medium text-gray-600">
                User ID
              </label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-600">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-600">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-600">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-600">
                Role
              </label>
              <div>
  <label htmlFor="role" className="block text-sm font-medium text-gray-600">
  </label>
  <CustomDropdown
    options={[
      { value: "user", label: "User" },
      { value: "admin", label: "Admin" }
    ]}
    value={formData.role}
    onChange={(value) =>
      setFormData((prev) => ({
        ...prev,
        role: value,
      }))
    }
    placeholder="Select Role"
  />
</div>
            </div>
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              Create User
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
  <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">Delete Existing User</h2>

        <label htmlFor="userSelect" className="block text-sm font-medium text-gray-600">
          Choose a user to delete
        </label>
        <div className="relative">
 
<CustomDropdown
  options={users.map((user) => ({
    value: user.id,
    label: `${user.fullName} (ID: ${user.id})`,
  }))}
  value={selectedUserId}
  onChange={setSelectedUserId}
  placeholder="-- Select User --"
/>

  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
    <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  </div>
</div>


        <button
          onClick={handleDeleteUser}
          className="mt-4 w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-1 focus:ring-red-400"
        >
          Delete User
        </button>
      </div>
    </div>
  );
};

export default CreateDeleteUsersPage;

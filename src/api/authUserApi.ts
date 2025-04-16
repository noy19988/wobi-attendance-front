import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export type Role = "admin" | "user";

export interface User {
  id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}

export interface LoginResponse {
  token: string;
  role: Role;
}

export const loginUser = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const response = await api.post("/auth/login", {
    username,
    password,
  });

  return response.data as LoginResponse;
};

export default api;


export const deleteUser = async (userId: string): Promise<{ message: string }> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found in localStorage");

  try {
    const response = await axios.delete<{ message: string }>(
      `http://localhost:3000/auth/delete/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user.");
  }
};

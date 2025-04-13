import axios from "axios";

export interface LoginResponse {
  token: string;
  role: "admin" | "user";
}

export const loginUser = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const response = await axios.post("http://localhost:3000/auth/login", {
    username,
    password,
  });

  return response.data as LoginResponse;
};

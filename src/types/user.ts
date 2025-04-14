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

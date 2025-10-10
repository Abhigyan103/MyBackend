import { Role } from "@/types/roles.js";

export const authenticateUser = async (email: string, password: string) => {
  // Simulate a database call to authenticate user
  if (email === "user@example.com" && password === "password123") {
    return {
      id: "user-id",
      email: "user@example.com",
      role: Role.USER,
    };
  }
  return null;
};

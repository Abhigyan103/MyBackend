import { Role } from "../types/roles.js";

export const authenticateUser = async (email: string, password: string) => {
  if (email === 'test@example.com' && password === 'password123') {
    return await getUserById('12345');
  }
  return null;
};

export const getUserById = async (id: string) => {
  // Simulate a database call to get user by ID
  if (id === '12345') {
    return { id: '12345', email: 'test@example.com', role: Role.USER };
  }
};
import { UserSchemas } from "@/schema/index.js";
import type { IUser } from "@/models/user.model.js";
import { comparePasswords, hashPassword } from "@/utils/password.js";

import * as authRepository from "./auth.repository.js";
import * as userService from "../user/user.service.js";
import type { IUserQuery } from "../user/user.types.js";

export const registerUser = async (
  email: string,
  password: string,
  roles: UserSchemas.Role[] = [UserSchemas.Roles.user]
) => {
  // const session = client.startSession();
  try {
    // session.startTransaction();

    const user = await userService.createUser({ email, roles });
    // Create password data
    // Has the password before calling this function
    const hashedPassword = hashPassword(password);
    await authRepository.createPassword(user.id, hashedPassword);
    // await session.commitTransaction();
    return authenticateUser({ id: user.id }, password);
  } catch (error) {
    // await session.abortTransaction();
    throw error;
  } finally {
    // session.endSession();
  }
};

export const authenticateUser = async (
  query: IUserQuery,
  password: string
): Promise<IUser> => {
  // Fetch user by email or username
  const user = await userService.getUser(query);
  if (!user) {
    throw new Error("User not found");
  }
  // Fetch password data
  const passwordData = await authRepository.getUserPassword(user.id, {
    projection: { _id: 0, passwordHash: 1 },
  });
  if (!passwordData) {
    throw new Error("Password data not found");
  }
  // Verify password
  // Hash the provided password with the stored salt and compare with stored hash
  const isValid = comparePasswords(password, passwordData.passwordHash);
  if (!isValid) {
    throw new Error("Invalid password");
  }
  return user;
};

export const deleteUser = async (userId: string) => {
  try {
    await authRepository.deleteUserPassword(userId);
    // Delete user
    await userService.deleteUser(userId);
  } catch (error) {
    throw error;
  }
};

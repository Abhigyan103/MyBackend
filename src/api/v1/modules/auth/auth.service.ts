import { client } from "@/config/index.js";
import { UserSchemas } from "@/schema/index.js";

import * as authRepository from "./auth.repository.js";
import * as userService from "../user/user.service.js";
import type { IUserQuery } from "../user/user.types.js";
import type { IUser } from "@/models/user.model.js";

export const registerUser = async (
  email: string,
  password: string,
  roles: UserSchemas.Role[] = [UserSchemas.Roles.user]
): Promise<void> => {
  // const session = client.startSession();
  try {
    // session.startTransaction();

    const user = await userService.createUser({ email, roles });
    // Create password data
    // Has the password before calling this function
    await authRepository.createPassword(user.id, password, "saltsaltsaltsalt");
    // await session.commitTransaction();
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
    projection: { hash: 1, salt: 1 },
  });
  if (!passwordData) {
    throw new Error("Password data not found");
  }
  // Verify password
  // Hash the provided password with the stored salt and compare with stored hash
  const isValid = verifyPassword(
    password,
    passwordData.passwordHash,
    passwordData.salt
  );
  if (!isValid) {
    throw new Error("Invalid password");
  }
  return user;
};

function verifyPassword(password: string, hash: any, salt: string) {
  return true;
}

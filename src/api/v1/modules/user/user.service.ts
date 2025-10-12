import type {
  CommandOperationOptions,
  DeleteOptions,
  FindOneOptions,
  InsertOneOptions,
  Sort,
  UpdateOptions,
} from "mongodb";

import { client } from "@/config/index.js";
import { UserSchemas } from "@/schema/index.js";

import * as userRepository from "./user.repository.js";
import type { IUser } from "@/models/user.model.js";
import type { IUserQuery } from "./user.types.js";

export const createUser = async (
  {
    email,
    roles,
    username,
  }: {
    email: string;
    roles: UserSchemas.Role[];
    username?: string;
  },
  options?: InsertOneOptions
): Promise<IUser> => {
  username = username || email.split("@")[0]!;
  return userRepository.createUser({ email, roles, username }, options);
};

export const getUser = async (
  query: IUserQuery,
  options?: FindOneOptions
): Promise<IUser | null> => {
  if (!(query.username || query.id || query.email)) {
    return null;
  }
  return userRepository.getUser(query, options);
};

export const updateUser = async (
  id: string,
  updates: Partial<Omit<IUser, "id" | "createdAt" | "updatedAt">>,
  options?: UpdateOptions & { sort?: Sort }
): Promise<boolean> => {
  return userRepository.updateUser(id, updates, options);
};

export const deleteUser = async (
  id: string,
  options?: DeleteOptions
): Promise<boolean> => {
  return userRepository.deleteUser(id, options);
};

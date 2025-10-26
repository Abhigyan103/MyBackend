import type {
  CommandOperationOptions,
  DeleteOptions,
  FindOneOptions,
  InsertOneOptions,
  Sort,
  UpdateOptions,
} from "mongodb";

import { UserSchemas } from "@/schema/index.js";
import type { IUser } from "@/models/user.model.js";

import * as userRepository from "./user.repository.js";
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
) => {
  username = username || email.split("@")[0]!;
  return userRepository.createUser({ email, roles, username }, options);
};

export const getUser = async (query: IUserQuery, options?: FindOneOptions) => {
  return userRepository.getUser(query, options);
};

export const updateUser = async (
  id: string,
  updates: Partial<Omit<IUser, "id" | "createdAt" | "updatedAt">>,
  options?: UpdateOptions & { sort?: Sort }
) => {
  return userRepository.updateUser(id, updates, options);
};

export const deleteUser = async (id: string, options?: DeleteOptions) => {
  return userRepository.deleteUser(id, options);
};

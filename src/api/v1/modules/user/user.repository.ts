import type {
  DeleteOptions,
  FindOneOptions,
  InsertOneOptions,
  Sort,
  UpdateOptions,
} from "mongodb";

import { type IUser, UserCollection, UserSchema } from "@/models/user.model.js";
import type { Role } from "@/schema/user.schema.js";
import type { IUserQuery } from "./user.types.js";

export const createUser = async (
  {
    email,
    roles,
    username,
  }: {
    email: string;
    roles: Role[];
    username: string;
  },
  options?: InsertOneOptions
): Promise<IUser> => {
  const newUser = UserSchema.parse({
    email,
    roles,
    username,
  });
  await UserCollection.insertOne(newUser, options);
  return newUser;
};

export const getUser = async (
  { email, id, username }: IUserQuery,
  options?: FindOneOptions
): Promise<IUser | null> => {
  const query: { [key: string]: string } = {};
  if (email) query.email = email;
  if (id) query.id = id;
  if (username) query.username = username;

  const user = await UserCollection.findOne(query, options);
  return user;
};

export const updateUser = async (
  id: string,
  updates: Partial<Omit<IUser, "id" | "createdAt" | "updatedAt">>,
  options?: UpdateOptions & {
    sort?: Sort;
  }
): Promise<boolean> => {
  const updatedUser = UserSchema.parse({
    ...updates,
    id,
  });
  const result = await UserCollection.updateOne(
    { id },
    { $set: updatedUser },
    options
  );
  return result.modifiedCount > 0;
};

export const deleteUser = async (
  id: string,
  options?: DeleteOptions
): Promise<boolean> => {
  const result = await UserCollection.deleteOne({ id }, options);
  return result.deletedCount > 0;
};

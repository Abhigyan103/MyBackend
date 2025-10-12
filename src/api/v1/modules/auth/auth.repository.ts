import type {
  DeleteOptions,
  FindOneOptions,
  InsertOneOptions,
  Sort,
  UpdateOptions,
} from "mongodb";

import {
  type IPassword,
  PasswordCollection,
  PasswordSchema,
} from "@/models/password.model.js";

export const createPassword = async (
  id: string,
  passwordHash: string,
  salt: string,
  options?: InsertOneOptions
): Promise<IPassword> => {
  const newPasswordData = PasswordSchema.parse({
    id,
    passwordHash,
    salt,
  });
  await PasswordCollection.insertOne(newPasswordData, options);
  return newPasswordData;
};

export const getUserPassword = async (
  id: string,
  options?: FindOneOptions
): Promise<IPassword | null> => {
  const passwordData = await PasswordCollection.findOne({ id }, options);
  return passwordData;
};

export const updateUserPassword = async (
  id: string,
  newPasswordHash: string,
  newSalt: string,
  options?: UpdateOptions & {
    sort?: Sort;
  }
): Promise<boolean> => {
  const updatedPasswordData = PasswordSchema.parse({
    id,
    passwordHash: newPasswordHash,
    salt: newSalt,
  });
  const result = await PasswordCollection.updateOne(
    { id },
    { $set: updatedPasswordData },
    options
  );
  return result.modifiedCount > 0;
};

export const deleteUserPassword = async (
  id: string,
  options?: DeleteOptions
): Promise<boolean> => {
  const result = await PasswordCollection.deleteOne({ id }, options);
  return result.deletedCount > 0;
};

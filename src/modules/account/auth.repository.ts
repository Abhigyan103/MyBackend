import type {
  DeleteOptions,
  FindOneOptions,
  InsertOneOptions,
  Sort,
  UpdateOptions,
} from "mongodb";

import {
  PasswordCollection,
  HashedPasswordSchema,
} from "@/models/password.model.js";

export const createPassword = async (
  id: string,
  passwordHash: string,
  options?: InsertOneOptions
) => {
  const newPasswordData = HashedPasswordSchema.parse({
    id,
    passwordHash,
  });
  await PasswordCollection.insertOne(newPasswordData, options);
  return newPasswordData;
};

export const getUserPassword = async (id: string, options?: FindOneOptions) => {
  const passwordData = await PasswordCollection.findOne({ id }, options);
  return passwordData;
};

export const updateUserPassword = async (
  id: string,
  newPasswordHash: string,
  options?: UpdateOptions & {
    sort?: Sort;
  }
) => {
  const updatedPasswordData = HashedPasswordSchema.parse({
    id,
    passwordHash: newPasswordHash,
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
) => {
  const result = await PasswordCollection.deleteOne({ id }, options);
  return result.deletedCount > 0;
};

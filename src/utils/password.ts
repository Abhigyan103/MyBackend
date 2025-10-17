import bcrypt from "bcryptjs";
import { PASSWORD_DATA_CONSTANTS } from "./constants.js";

export const hashPassword = (password: string) => {
  return bcrypt.hashSync(password, PASSWORD_DATA_CONSTANTS.SALT_LENGTH);
};

export const comparePasswords = (password: string, hash: string) => {
  return bcrypt.compareSync(password, hash);
};

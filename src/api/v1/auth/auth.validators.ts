import { z } from "zod";

import { PASSWORD_DATA_CONSTANTS } from "@/utils/constants.js";

export const PasswordSchema = z
  .string()
  .min(
    PASSWORD_DATA_CONSTANTS.MIN_PASSWORD_LENGTH,
    `Password must be at least ${PASSWORD_DATA_CONSTANTS.MIN_PASSWORD_LENGTH} characters long.`
  )
  .max(
    PASSWORD_DATA_CONSTANTS.MAX_PASSWORD_LENGTH,
    `Password must be at most ${PASSWORD_DATA_CONSTANTS.MAX_PASSWORD_LENGTH} characters long.`
  )
  .regex(
    PASSWORD_DATA_CONSTANTS.UPPERCASE_REGEX,
    "Password must contain at least one uppercase letter."
  )
  .regex(
    PASSWORD_DATA_CONSTANTS.LOWERCASE_REGEX,
    "Password must contain at least one lowercase letter."
  )
  .regex(
    PASSWORD_DATA_CONSTANTS.NUMBER_REGEX,
    "Password must contain at least one number."
  )
  .regex(
    PASSWORD_DATA_CONSTANTS.SPECIAL_CHAR_REGEX,
    "Password must contain at least one special character (!@#$%^&*)."
  )
  .trim();

export const loginBodySchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(1).max(100),
});

export const registerBodySchema = z.object({
  email: z.email({ message: "Invalid email address." }),
  password: PasswordSchema,
});

export const changePasswordBodySchema = z.object({
  oldPassword: z.string().min(1).max(100),
  newPassword: PasswordSchema,
});

export type LoginRequestBody = z.infer<typeof loginBodySchema>;
export type RegisterRequestBody = z.infer<typeof registerBodySchema>;
export type ChangePasswordRequestBody = z.infer<
  typeof changePasswordBodySchema
>;

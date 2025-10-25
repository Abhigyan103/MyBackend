import { PASSWORD_DATA_CONSTANTS } from "@/utils/constants.js";
import z from "zod";

export const RegisterUserSchema = z.object({
  email: z.email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(
      PASSWORD_DATA_CONSTANTS.MIN_PASSWORD_LENGTH,
      `Password must be at least ${PASSWORD_DATA_CONSTANTS.MIN_PASSWORD_LENGTH} characters long`
    )
    .max(
      PASSWORD_DATA_CONSTANTS.MAX_PASSWORD_LENGTH,
      `Password must be at most ${PASSWORD_DATA_CONSTANTS.MAX_PASSWORD_LENGTH} characters long`
    ),
});

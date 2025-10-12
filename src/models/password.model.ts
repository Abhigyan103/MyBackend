import { z } from "zod";

import {
  USER_MODEL_CONSTANTS,
  PASSWORD_DATA_CONSTANTS,
} from "@/utils/constants.js";
import { db } from "@/config/index.js";

const { ID_LENGTH } = USER_MODEL_CONSTANTS;
const { SALT_LENGTH } = PASSWORD_DATA_CONSTANTS;

const PasswordSchema = z.object({
  id: z.string().length(ID_LENGTH, `ID must be ${ID_LENGTH} characters long`),
  passwordHash: z.string().min(1),
  salt: z.string().length(SALT_LENGTH),
  createdAt: z.date().optional().default(new Date()),
});

type IPassword = z.infer<typeof PasswordSchema>;
const PasswordCollection = db.collection<IPassword>("passwords");

PasswordCollection.createIndex({ id: 1 }, { unique: true });

export { type IPassword, PasswordSchema, PasswordCollection };

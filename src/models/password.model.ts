import { z } from "zod";

import { USER_MODEL_CONSTANTS } from "@/utils/constants.js";
import { db } from "@/config/index.js";

const { ID_LENGTH } = USER_MODEL_CONSTANTS;

const HashedPasswordSchema = z.object({
  id: z.string().length(ID_LENGTH, `ID must be ${ID_LENGTH} characters long`),
  passwordHash: z.string().min(1),
  createdAt: z.date().optional().default(new Date()),
});

type IPassword = z.infer<typeof HashedPasswordSchema>;
const PasswordCollection = db.collection<IPassword>("passwords");

PasswordCollection.createIndex({ id: 1 }, { unique: true });

export { type IPassword, HashedPasswordSchema, PasswordCollection };

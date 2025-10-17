import { z } from "zod";
import { ulid } from "ulid";

import { db } from "@/config/index.js";
import { USER_MODEL_CONSTANTS } from "@/utils/constants.js";
import { CommonSchemas, UserSchemas } from "@/schema/index.js";
import { PROFILE_PICTURE_DEFAULT_URL } from "@/utils/stringConstants.js";

const { ID_LENGTH } = USER_MODEL_CONSTANTS;

const UserSchema = z.object({
  email: UserSchemas.EmailSchema,
  roles: UserSchemas.RolesSchema,
  firstName: UserSchemas.FirstNameSchema,
  lastName: UserSchemas.LastNameSchema,
  phone: UserSchemas.PhoneNumberSchema,
  addresses: z.array(UserSchemas.AddressSchema).optional().default([]),
  bio: UserSchemas.BioSchema,
  username: UserSchemas.UsernameSchema,
  hasInitialized: z.boolean().default(false),
  profilePictureUrl: z
    .url("Must be a valid URL")
    .optional()
    .default(PROFILE_PICTURE_DEFAULT_URL),
  isActive: z.boolean().default(true),
  id: z
    .string()
    .length(ID_LENGTH, `ID must be ${ID_LENGTH} characters long`)
    .default(() => ulid()),
  createdAt: CommonSchemas.DateSchema,
  updatedAt: CommonSchemas.DateSchema,
});

type IUser = z.infer<typeof UserSchema>;
const UserCollection = db.collection<IUser>("users");

UserCollection.createIndex({ email: 1 }, { unique: true });
UserCollection.createIndex({ id: 1 }, { unique: true });
UserCollection.createIndex({ username: 1 }, { unique: true });

export { type IUser, UserSchema, UserCollection };

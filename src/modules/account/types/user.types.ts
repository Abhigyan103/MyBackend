import type { ExactlyOne } from "@/utils/validation.js";

export type IUserQuery = ExactlyOne<{
  email: string;
  username: string;
  id: string;
}>;

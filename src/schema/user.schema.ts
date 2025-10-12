import z from "zod";

export const UsernameSchema = z
  .string()
  .trim()
  .toLowerCase() // Optional: Enforce lowercase for consistency
  .min(1, "Username is required.")
  .min(4, "Username must be at least 4 characters long.")
  .max(20, "Username cannot exceed 20 characters.")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers, and underscores."
  )
  .refine(
    (val) => !val.startsWith("_") && !val.endsWith("_"),
    "Username cannot start or end with an underscore."
  );

export const PhoneNumberSchema = z
  .string()
  .trim()
  .regex(
    /^(\+\d{1,3})?\d{6,15}$/,
    "Must be a valid phone number format (6-15 digits, optional country code)."
  )
  .nullable()
  .optional()
  .default(null);

export const AddressLineSchema = z
  .string()
  .trim()
  .max(100, "Address line cannot exceed 100 characters.")
  .nullable()
  .optional()
  .default(null);

export const CityOrCountrySchema = z
  .string()
  .trim()
  .max(50, "City or country cannot exceed 50 characters.")
  .nullable()
  .optional()
  .default(null);

export const PinCodeSchema = z
  .string()
  .trim()
  .regex(/^[a-zA-Z0-9-]{3,10}$/, "Must be a valid postal/zip code.")
  .nullable()
  .optional()
  .default(null);

export const AddressSchema = z.object({
  addressLine1: AddressLineSchema,
  addressLine2: AddressLineSchema,
  city: CityOrCountrySchema,
  country: CityOrCountrySchema,
  pinCode: PinCodeSchema,
});

export const BioSchema = z
  .string()
  .trim()
  .max(500, "Bio is too long (max 500 characters).")
  .nullable()
  .optional()
  .default(null);

export const FirstNameSchema = z
  .string()
  .trim()
  .min(1, "First name cannot be empty.")
  .max(50, "First name is too long (max 50 characters).")
  .nullable()
  .optional()
  .default(null);

export const LastNameSchema = z
  .string()
  .trim()
  .min(1, "Last name cannot be empty.")
  .max(50, "Last name is too long (max 50 characters).")
  .nullable()
  .optional()
  .default(null);

export const EmailSchema = z
  .email("Invalid email format")
  .trim() // Remove leading/trailing whitespace
  .toLowerCase() // Standardize to lowercase
  .min(1, "Email is required.")
  .max(255, "Email cannot exceed 255 characters.");

export const RoleSchema = z.enum(
  ["user", "admin", "superadmin"],
  "Invalid role"
);
export type Role = z.infer<typeof RoleSchema>;
export const Roles = RoleSchema.enum;

export const RolesSchema = z
  .array(RoleSchema)
  .min(1, "At least one role must be assigned.")
  .default([Roles.user]);

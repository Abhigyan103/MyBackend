export const USER_MODEL_CONSTANTS = {
  MAX_USERNAME_LENGTH: 30,
  MIN_USERNAME_LENGTH: 3,
  MAX_EMAIL_LENGTH: 254,
  ID_LENGTH: 26,
};

export const PASSWORD_DATA_CONSTANTS = {
  MAX_PASSWORD_LENGTH: 100,
  MIN_PASSWORD_LENGTH: 8,
  SALT_LENGTH: 10,
  SPECIAL_CHAR_REGEX: /(?=.*[!@#$%^&*])/, // Requires at least one special character
  UPPERCASE_REGEX: /(?=.*[A-Z])/, // Requires at least one uppercase letter
  LOWERCASE_REGEX: /(?=.*[a-z])/, // Requires at least one lowercase letter
  NUMBER_REGEX: /(?=.*\d)/, // Requires at least one number
  // Final regex combines all lookaheads for simultaneous checks
  COMPLEXITY_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/,
};

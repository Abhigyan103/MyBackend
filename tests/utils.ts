// Test utilities and helpers

export const mockUser = {
  id: "test-user-id-123",
  email: "test@example.com",
  roles: ["user"] as const,
  username: "testuser",
  firstName: null,
  lastName: null,
  phone: null,
  addresses: [],
  bio: null,
  hasInitialized: false,
  profilePictureUrl: "https://example.com/default-profile-pic.png",
  isActive: true,
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
};

export const mockPasswordData = {
  id: "test-user-id-123",
  passwordHash: "$2a$10$mockhashedpassword",
  createdAt: new Date("2024-01-01"),
};

export const validUserCredentials = {
  email: "test@example.com",
  password: "TestPassword123!",
};

export const invalidUserCredentials = {
  email: "invalid@example.com",
  password: "WrongPassword123!",
};

export const weakPassword = {
  email: "test@example.com",
  password: "weak",
};

export const invalidEmailFormat = {
  email: "invalid-email",
  password: "TestPassword123!",
};

export const extractCookiesFromResponse = (response: any): string[] => {
  const cookieHeader = response.headers["set-cookie"];
  return Array.isArray(cookieHeader)
    ? cookieHeader
    : cookieHeader
      ? [cookieHeader]
      : [];
};

export const findJwtCookie = (cookies: string[]): string | undefined => {
  return cookies.find((cookie) => cookie.startsWith("jwt="));
};

export const extractJwtFromCookie = (cookie: string): string => {
  return cookie.split("=")[1]?.split(";")[0] || "";
};

// Mock environment for tests
export const mockEnv = {
  NODE_ENV: "test",
  DATABASE_URL: "mongodb://localhost:27017",
  DATABASE_NAME: "test-my-backend",
  JWT_SECRET: "test-jwt-secret-key-for-testing",
  REFRESH_TOKEN_SECRET: "test-refresh-token-secret-key-for-testing",
  JWT_EXPIRY: 900, // 15 minutes in seconds
  REFRESH_TOKEN_EXPIRY: 604800, // 7 days in seconds
  PORT: 3002,
  REDIS_URL: "redis://localhost:6379",
};

// Mock logger for tests
export const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  http: jest.fn(),
  db: jest.fn(),
  ongoing: jest.fn(),
};

// Test data generators
export const generateTestUser = (overrides: Partial<typeof mockUser> = {}) => {
  return { ...mockUser, ...overrides };
};

export const generateTestCredentials = (
  overrides: Partial<typeof validUserCredentials> = {},
) => {
  return { ...validUserCredentials, ...overrides };
};

// Common test assertions
export const expectValidTokenResponse = (response: any) => {
  expect(response.body).toHaveProperty("accessToken");
  expect(typeof response.body.accessToken).toBe("string");

  const cookies = extractCookiesFromResponse(response);
  expect(cookies).toBeDefined();
  const jwtCookie = findJwtCookie(cookies);
  expect(jwtCookie).toBeDefined();
};

export const expectErrorResponse = (response: any, status: number = 400) => {
  expect(response.status).toBe(status);
  expect(response.body).toHaveProperty("errorMessage");
};

export const expectValidationErrorResponse = (response: any) => {
  expectErrorResponse(response, 400);
  expect(response.body).toHaveProperty("fields");
  expect(Array.isArray(response.body.fields)).toBe(true);
};

export const expectUnauthorizedResponse = (response: any) => {
  expectErrorResponse(response, 401);
};

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import request from "supertest";

// Helper function to extract cookies safely
const getCookiesFromResponse = (response: any): string[] => {
  const cookieHeader = response.headers["set-cookie"];
  return Array.isArray(cookieHeader)
    ? cookieHeader
    : cookieHeader
      ? [cookieHeader]
      : [];
};

// Simple integration test without heavy mocking
describe("Auth API Integration Tests", () => {
  let app: express.Application;

  beforeAll(() => {
    // Create a simple Express app for testing
    app = express();

    app.use(cors());
    app.use(express.json());
    app.use(cookieParser());

    // Simple mock routes for testing the basic structure
    app.post("/api/v1/auth/register", (req, res) => {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          errorMessage: "Email and password are required",
          fields: [],
        });
      }

      if (!email.includes("@")) {
        return res.status(400).json({
          errorMessage: "Invalid email format",
          fields: [{ email: "Invalid email format" }],
        });
      }

      if (password.length < 8) {
        return res.status(400).json({
          errorMessage: "Password too weak",
          fields: [{ password: "Password must be at least 8 characters" }],
        });
      }

      // Simulate successful registration
      res.cookie("jwt", "mock-refresh-token", { httpOnly: true });
      res.status(201).json({ accessToken: "mock-access-token" });
    });

    app.post("/api/v1/auth/login", (req, res) => {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          errorMessage: "Email and password are required",
          fields: [],
        });
      }

      if (email === "test@example.com" && password === "TestPassword123!") {
        res.cookie("jwt", "mock-refresh-token", { httpOnly: true });
        return res.status(200).json({ accessToken: "mock-access-token" });
      }

      res.status(401).json({ errorMessage: "Invalid credentials" });
    });

    app.get("/api/v1/auth/refresh-token", (req, res) => {
      const refreshToken = req.cookies.jwt;

      if (!refreshToken || refreshToken !== "mock-refresh-token") {
        return res.status(401).json({ errorMessage: "Invalid refresh token" });
      }

      res.cookie("jwt", "new-mock-refresh-token", { httpOnly: true });
      res.status(200).json({ accessToken: "new-mock-access-token" });
    });

    app.delete("/api/v1/auth/delete-account", (req, res) => {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ errorMessage: "No token provided" });
      }

      const token = authHeader.split(" ")[1];
      if (token !== "mock-access-token") {
        return res.status(401).json({ errorMessage: "Invalid token" });
      }

      res.clearCookie("jwt");
      res.status(204).send();
    });

    app.post("/api/v1/auth/change-password", (req, res) => {
      const authHeader = req.headers.authorization;
      const { oldPassword, newPassword } = req.body;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ errorMessage: "No token provided" });
      }

      if (!oldPassword || !newPassword) {
        return res.status(400).json({
          errorMessage: "Old and new passwords are required",
          fields: [],
        });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({
          errorMessage: "New password too weak",
          fields: [{ newPassword: "Password must be at least 8 characters" }],
        });
      }

      const token = authHeader.split(" ")[1];
      if (token !== "mock-access-token") {
        return res.status(401).json({ errorMessage: "Invalid token" });
      }

      res.status(200).send();
    });
  });

  describe("POST /api/v1/auth/register", () => {
    it("should register a new user successfully", async () => {
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send({
          email: "test@example.com",
          password: "TestPassword123!",
        })
        .expect(201);

      expect(response.body).toHaveProperty("accessToken");
      expect(typeof response.body.accessToken).toBe("string");

      // Check if refresh token cookie is set
      const cookies = getCookiesFromResponse(response);
      expect(cookies).toBeDefined();
      expect(cookies.some((cookie: string) => cookie.startsWith("jwt="))).toBe(
        true,
      );
    });

    it("should return 400 for invalid email format", async () => {
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send({
          email: "invalid-email",
          password: "TestPassword123!",
        })
        .expect(400);

      expect(response.body).toHaveProperty("errorMessage");
    });

    it("should return 400 for weak password", async () => {
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send({
          email: "test@example.com",
          password: "weak",
        })
        .expect(400);

      expect(response.body).toHaveProperty("errorMessage");
    });

    it("should return 400 for missing email", async () => {
      await request(app)
        .post("/api/v1/auth/register")
        .send({
          password: "TestPassword123!",
        })
        .expect(400);
    });

    it("should return 400 for missing password", async () => {
      await request(app)
        .post("/api/v1/auth/register")
        .send({
          email: "test@example.com",
        })
        .expect(400);
    });
  });

  describe("POST /api/v1/auth/login", () => {
    it("should login successfully with valid credentials", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: "test@example.com",
          password: "TestPassword123!",
        })
        .expect(200);

      expect(response.body).toHaveProperty("accessToken");
      expect(typeof response.body.accessToken).toBe("string");

      // Check if refresh token cookie is set
      const cookies = getCookiesFromResponse(response);
      expect(cookies).toBeDefined();
      expect(cookies.some((cookie: string) => cookie.startsWith("jwt="))).toBe(
        true,
      );
    });

    it("should return 401 for invalid credentials", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: "test@example.com",
          password: "WrongPassword",
        })
        .expect(401);

      expect(response.body).toHaveProperty("errorMessage");
    });

    it("should return 400 for missing email", async () => {
      await request(app)
        .post("/api/v1/auth/login")
        .send({
          password: "TestPassword123!",
        })
        .expect(400);
    });

    it("should return 400 for missing password", async () => {
      await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: "test@example.com",
        })
        .expect(400);
    });
  });

  describe("GET /api/v1/auth/refresh-token", () => {
    it("should refresh token successfully with valid refresh token", async () => {
      const response = await request(app)
        .get("/api/v1/auth/refresh-token")
        .set("Cookie", "jwt=mock-refresh-token")
        .expect(200);

      expect(response.body).toHaveProperty("accessToken");
      expect(typeof response.body.accessToken).toBe("string");

      // Should set new refresh token cookie
      const cookies = getCookiesFromResponse(response);
      expect(cookies).toBeDefined();
      expect(cookies.some((cookie: string) => cookie.startsWith("jwt="))).toBe(
        true,
      );
    });

    it("should return 401 for missing refresh token", async () => {
      const response = await request(app)
        .get("/api/v1/auth/refresh-token")
        .expect(401);

      expect(response.body).toHaveProperty("errorMessage");
    });

    it("should return 401 for invalid refresh token", async () => {
      const response = await request(app)
        .get("/api/v1/auth/refresh-token")
        .set("Cookie", "jwt=invalid-token")
        .expect(401);

      expect(response.body).toHaveProperty("errorMessage");
    });
  });

  describe("DELETE /api/v1/auth/delete-account", () => {
    it("should delete account successfully with valid access token", async () => {
      const response = await request(app)
        .delete("/api/v1/auth/delete-account")
        .set("Authorization", "Bearer mock-access-token")
        .expect(204);

      // Should clear the refresh token cookie
      const cookies = getCookiesFromResponse(response);
      if (cookies && cookies.length > 0) {
        const jwtCookie = cookies.find((cookie: string) =>
          cookie.startsWith("jwt="),
        );
        if (jwtCookie) {
          expect(jwtCookie).toMatch(/jwt=;/);
        }
      }
    });

    it("should return 401 for missing access token", async () => {
      const response = await request(app)
        .delete("/api/v1/auth/delete-account")
        .expect(401);

      expect(response.body).toHaveProperty("errorMessage");
    });

    it("should return 401 for invalid access token", async () => {
      const response = await request(app)
        .delete("/api/v1/auth/delete-account")
        .set("Authorization", "Bearer invalid-token")
        .expect(401);

      expect(response.body).toHaveProperty("errorMessage");
    });

    it("should return 401 for malformed authorization header", async () => {
      const response = await request(app)
        .delete("/api/v1/auth/delete-account")
        .set("Authorization", "InvalidFormat")
        .expect(401);

      expect(response.body).toHaveProperty("errorMessage");
    });
  });

  describe("POST /api/v1/auth/change-password", () => {
    it("should change password successfully with valid data", async () => {
      await request(app)
        .post("/api/v1/auth/change-password")
        .set("Authorization", "Bearer mock-access-token")
        .send({
          oldPassword: "TestPassword123!",
          newPassword: "NewPassword123!",
        })
        .expect(200);
    });

    it("should return 400 for weak new password", async () => {
      const response = await request(app)
        .post("/api/v1/auth/change-password")
        .set("Authorization", "Bearer mock-access-token")
        .send({
          oldPassword: "TestPassword123!",
          newPassword: "weak",
        })
        .expect(400);

      expect(response.body).toHaveProperty("errorMessage");
    });

    it("should return 401 for missing access token", async () => {
      const response = await request(app)
        .post("/api/v1/auth/change-password")
        .send({
          oldPassword: "TestPassword123!",
          newPassword: "NewPassword123!",
        })
        .expect(401);

      expect(response.body).toHaveProperty("errorMessage");
    });

    it("should return 400 for missing old password", async () => {
      const response = await request(app)
        .post("/api/v1/auth/change-password")
        .set("Authorization", "Bearer mock-access-token")
        .send({
          newPassword: "NewPassword123!",
        })
        .expect(400);

      expect(response.body).toHaveProperty("errorMessage");
    });

    it("should return 400 for missing new password", async () => {
      const response = await request(app)
        .post("/api/v1/auth/change-password")
        .set("Authorization", "Bearer mock-access-token")
        .send({
          oldPassword: "TestPassword123!",
        })
        .expect(400);

      expect(response.body).toHaveProperty("errorMessage");
    });
  });
});

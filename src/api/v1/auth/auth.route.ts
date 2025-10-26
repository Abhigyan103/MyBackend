import { Router } from "express";

import { restrictFromPublic } from "@/middleware/auth.middleware.js";
import {
  validate,
  ValidationSource,
} from "@/middleware/validator.middleware.js";

import {
  changePasswordBodySchema,
  loginBodySchema,
  registerBodySchema,
} from "./auth.validators.js";
import {
  changePassword,
  deleteAccount,
  login,
  refreshToken,
  register,
} from "./auth.controller.js";

const router = Router();

router.post("/login", validate(loginBodySchema, ValidationSource.BODY), login); // /api/v1/auth/login
router.post(
  "/register",
  validate(registerBodySchema, ValidationSource.BODY),
  register
); // /api/v1/auth/register
router.post(
  "/change-password",
  restrictFromPublic,
  validate(changePasswordBodySchema, ValidationSource.BODY),
  changePassword
); // /api/v1/auth/change-password
router.delete("/delete-account", restrictFromPublic, deleteAccount); // /api/v1/auth/delete-account
router.get("/refresh-token", refreshToken); // /api/v1/auth/refresh-token

export default router;

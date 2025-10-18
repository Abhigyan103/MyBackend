import { Router } from "express";
import {
  deleteAccount,
  login,
  refreshToken,
  register,
} from "./auth.controller.js";
import { restrictFromPublic } from "@/middleware/auth.middleware.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/forgot-password", login);
router.post("/change-password", login);
router.post("/reset-password", login);
router.delete("/delete-account", restrictFromPublic, deleteAccount);
router.get("/refresh-token", refreshToken);

export default router;

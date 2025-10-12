import { Router } from "express";
import { login, refreshToken, register } from "./auth.controller.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/forgot-password", login);
router.post("/change-password", login);

router.get("/refreshToken", refreshToken);

export default router;

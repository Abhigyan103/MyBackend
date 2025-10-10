import { Router } from "express";
import { login, refreshToken } from "./auth.controller.js";

const router = Router();

router.post("/login", login);
router.get("/refreshToken", refreshToken);

export default router;

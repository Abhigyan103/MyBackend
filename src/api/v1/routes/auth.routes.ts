import { Router } from "express";
import { login, refreshToken } from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", login);
router.get("/refreshToken", refreshToken);

export default router;

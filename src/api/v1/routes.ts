import { Router } from "express";
import authRoutes from "./auth/auth.route.js";
import healthRoutes from "./health/health.route.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/health", healthRoutes);

export default router;

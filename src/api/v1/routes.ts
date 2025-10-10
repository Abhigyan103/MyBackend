import { Router } from "express";
import authRoutes from "./modules/auth/auth.route.js";
import healthRoutes from "./modules/health/health.route.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/health", healthRoutes);

export default router;

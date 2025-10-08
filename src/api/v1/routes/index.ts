import { Router } from "express";
import authRoutes from "./auth.routes.js";
import postRoutes from "./post.routes.js";
import { protectFor } from "../../../middleware/auth.middleware.js";
import { Role } from "../../../types/roles.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/posts", protectFor([Role.ADMIN]), postRoutes);

export default router;

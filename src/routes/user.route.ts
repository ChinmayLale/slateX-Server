// src/routes/userRoutes.ts
import { Router } from "express";
import { getUserProfile } from "../controllers/user.controller";
import { requireAuth } from "@clerk/express";

const router = Router();

// Protect route with Clerk auth middleware
router.get("/profile", requireAuth(), getUserProfile);

export default router;

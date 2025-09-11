"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/userRoutes.ts
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const express_2 = require("@clerk/express");
const router = (0, express_1.Router)();
// Protect route with Clerk auth middleware
router.get("/profile", (0, express_2.requireAuth)(), user_controller_1.getUserProfile);
exports.default = router;

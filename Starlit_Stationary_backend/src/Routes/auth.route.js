import express from "express";
import { logout,signup,login,check } from "../Controllers/auth.controller.js";
import { protectRoute } from "../Middleware/auth.middleware.js";
import { authLimiter, loginLimiter, logoutLimiter, withRateLimit } from "../lib/rateLimiting.js";
const router = express.Router();

router.post("/signup", withRateLimit(authLimiter), signup)
router.post("/login", withRateLimit(loginLimiter), login)
router.post("/logout", withRateLimit(logoutLimiter), logout)
router.get("/check", withRateLimit(authLimiter), protectRoute, check)

export default router;
// src/routes/authRoutes.js
import express from "express";
import passport from "passport";
import { handleGoogleCallback, register, login, verifyOtp, forgotPassword, resetPassword, me } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/signin", session: false }),
  handleGoogleCallback
);

// 🔹 Email-password auth
router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOtp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/me", authMiddleware, me);

export default router;

// backend/routes/authRoutes.js
import { sendOtpController, verifyOtpController } from "../controllers/otpController.js";
import express from "express";
import User from "../models/User.js";
import { registerUser, loginUser, adminLogin, getMe, deleteUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login (user)
router.post("/login", loginUser);

// Login (admin)
router.post("/admin/login", adminLogin);

// Fixed path: added missing leading slash
router.get("/me", protect, getMe);

// ✅ Delete Account
router.delete("/:id", protect, deleteUser);

// send OTP
router.post("/send-otp", sendOtpController);

// verify OTP
router.post("/verify-otp", verifyOtpController);

export default router;

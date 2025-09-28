import express from "express";
import {
  registerUser,
  loginWithOtpController,   // login with password → send OTP
  sendOtpController,        // manual OTP send (if needed)
  verifyOtpController,      // final OTP verification
  adminLogin,
  getMe,
  deleteUser
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js"; // ✅ needed for get-email-by-username

const router = express.Router();

/* ================= AUTH ROUTES ================= */

// ✅ Register new user
router.post("/register", registerUser);

// ✅ Login with password → sends OTP to user’s email
router.post("/login", loginWithOtpController);

// ✅ Verify OTP (after password + OTP)
router.post("/verify-otp", verifyOtpController);

// ✅ Send OTP manually (optional, for testing or passwordless login)
router.post("/send-otp", sendOtpController);

// ✅ Admin login
router.post("/admin/login", adminLogin);

// ✅ Get current user (requires JWT token)
router.get("/me", protect, getMe);

// ✅ Delete user account (requires JWT token)
router.delete("/:id", protect, deleteUser);

/* ================= EXTRA ROUTES ================= */

// ✅ (Optional) Get email by username
router.post("/get-email-by-username", async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ email: user.email });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

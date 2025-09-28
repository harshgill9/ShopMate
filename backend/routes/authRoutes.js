// backend/routes/authRoutes.js
import express from "express";
import {
  registerUser,
  loginUser, // if you want normal login without OTP
  loginWithOtpController,
  sendOtpController,
  verifyOtpController,
  adminLogin,
  getMe,
  deleteUser
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Register
router.post("/register", registerUser);

// ✅ Login (normal login, optional)
router.post("/login-normal", loginUser); // optional if you want username + password without OTP

// ✅ Login with password → send OTP to email
router.post("/login", loginWithOtpController);

// ✅ Admin login
router.post("/admin/login", adminLogin);

// ✅ Get current user (requires auth token)
router.get("/me", protect, getMe);

// ✅ Delete user account (requires auth token)
router.delete("/:id", protect, deleteUser);

// ✅ Send OTP manually to email (if needed)
router.post("/send-otp", sendOtpController);

// ✅ Verify OTP
router.post("/verify-otp", verifyOtpController);

// ❌ (Optional) Get email by username → remove if not needed
router.post("/get-email-by-username", async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ email: user.email });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

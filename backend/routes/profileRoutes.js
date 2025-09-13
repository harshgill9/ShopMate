import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Get logged in user profile
router.get("/me", protect, async (req, res) => {
  try {
    const user = req.user; // middleware se aaya
    res.json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      shippingAddress: user.shippingAddress,
    });
  } catch (error) {
    console.error("❌ GET profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update profile of logged in user
router.put("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.body.shippingAddress){
      user.shippingAddress = req.body.shippingAddress;
    }

    if (req.body.shippingAddress?.fullName) {
      user.name = req.body.shippingAddress.fullName;
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      shippingAddress: updatedUser.shippingAddress,
    });
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

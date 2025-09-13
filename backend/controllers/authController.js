import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ===== Helper: Generate JWT =====
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ===== Register =====
export const registerUser = async (req, res) => {
  try {
    const { name, username, email, phoneNumber, password } = req.body;

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing)
      return res.status(400).json({ success: false, msg: "User already exists" });

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      username,
      email,
      phoneNumber,
      password: hash,
      role: "user",
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ success: false, msg: "Server Error" });
  }
};

// ===== Login (user) =====
export const loginUser = async (req, res) => {
  try {
    console.log("🟢 Login API hit:", req.body); 
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide both username and password" });
    }

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ success: false, msg: "Invalid username or password" });
    }

    // Compare password
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(400).json({ success: false, msg: "Wrong password ❌" });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ success: false, msg: "Server Error" });
  }
};


// ===== Login (admin) =====
export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user)
      return res.status(400).json({ success: false, msg: "Invalid Credentials" });
    if (user.role !== "admin")
      return res
        .status(403)
        .json({ success: false, msg: "Access Denied: Not an admin." });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return res.status(400).json({ success: false, msg: "Invalid Credentials" });

    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Admin login error:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ===== Get current user (/me) =====
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ success: false, msg: "User not found" });

    res.json({
      success: true,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        shippingAddress: user.shippingAddress || null,
      },
    });
  } catch (err) {
    console.error("Fetch user error:", err.message);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

// ===== Delete User Account =====
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    console.log("🛠 Delete request received for:", userId);
    console.log("🛠 Logged in user:", req.user._id);

    // Sirf wahi user apna account delete kar sakta hai
    if (req.user._id.toString() !== userId.toString()) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized to delete this account" });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    console.error("❌ Delete user error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};



import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import User from "../models/User.js";
import { generateOTP, hashOTP } from "../utils/otp.js";

dotenv.config();

/* ========== JWT HELPER ========== */
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

/* ========== EMAIL TRANSPORT (Brevo/SendinBlue SMTP) ========== */
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER, // Brevo SMTP login (your email)
    pass: process.env.EMAIL_PASS, // Brevo SMTP key
  },
});

/* ========== Helper: Send OTP Email ========== */
const sendOtpEmail = async (to, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Your OTP Code",
    html: `<h3>Your OTP</h3><p><strong>${otp}</strong></p><p>This code will expire in 5 minutes.</p>`,
  });
};

/* ========== REGISTER USER ========== */
export const registerUser = asyncHandler(async (req, res) => {
  const { name, username, email, phoneNumber, password } = req.body;

  if (!name || !username || !email || !phoneNumber || !password) {
    return res.status(400).json({ success: false, msg: "All fields are required" });
  }

  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    return res.status(400).json({ success: false, msg: "Username already exists" });
  }

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
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
    },
  });
});

/* ========== LOGIN (PASSWORD → OTP) ========== */
export const loginWithOtpController = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  console.log("📥 OTP login request:", username);

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Username and password required" });
  }

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: "Invalid password" });
  }

  const otp = generateOTP();
  const hashedOtp = hashOTP(otp);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

  user.otpHash = hashedOtp;
  user.otpExpiresAt = expiresAt;
  await user.save();

  try {
    await sendOtpEmail(user.email, otp);
    console.log("✅ OTP sent to:", user.email);

    return res.status(200).json({
      success: true,
      email: user.email,
      message: "OTP sent to your registered email",
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP. Please try again later.",
    });
  }
});

/* ========== VERIFY OTP ========== */
export const verifyOtpController = asyncHandler(async (req, res) => {
  const { username, otp } = req.body;

  console.log("Received OTP verification request:", username, otp);

  if (!username || !otp) {
    return res.status(400).json({ success: false, message: "Username and OTP required" });
  }

  const user = await User.findOne({ username }).select("+otpHash +otpExpiresAt");

  if (!user || !user.otpHash || !user.otpExpiresAt) {
    return res.status(400).json({ success: false, message: "OTP not requested or invalid user" });
  }

  if (new Date() > user.otpExpiresAt) {
    user.otpHash = undefined;
    user.otpExpiresAt = undefined;
    await user.save();
    return res.status(400).json({ success: false, message: "OTP expired" });
  }

  if (hashOTP(otp) !== user.otpHash) {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }

  user.otpHash = undefined;
  user.otpExpiresAt = undefined;
  await user.save();

  const token = generateToken(user);

  res.status(200).json({
    success: true,
    message: "Logged in successfully via OTP",
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
});

/* ========== MANUAL SEND OTP (optional) ========== */
export const sendOtpController = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const otp = generateOTP();
  const hashedOtp = hashOTP(otp);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  user.otpHash = hashedOtp;
  user.otpExpiresAt = expiresAt;
  await user.save();

  try {
    await sendOtpEmail(user.email, otp);

    res.status(200).json({
      success: true,
      message: "OTP sent to your registered email",
      email: user.email,
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP. Please try again later.",
    });
  }
});

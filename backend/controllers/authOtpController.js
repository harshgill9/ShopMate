import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { generateOTP, hashOTP } from "../utils/otp.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Email transporter setup
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send OTP Controller
export const sendOtpController = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Received email:", email);
    if (!email) {
      res.status(400);
      throw new Error("Email is required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const otp = generateOTP();
    const hashedOtp = hashOTP(otp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    user.otpHash = hashedOtp;
    user.otpExpiresAt = expiresAt;
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      html: `<h3>Your OTP</h3><p><strong>${otp}</strong></p><p>This code will expire in 5 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.error("Send OTP Error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
});


// Verify OTP Controller
export const verifyOtpController = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    res.status(400);
    throw new Error("Email and OTP are required");
  }

  const user = await User.findOne({ email });
  if (!user || !user.otpHash || !user.otpExpiresAt) {
    res.status(400);
    throw new Error("OTP not requested");
  }

  if (new Date() > user.otpExpiresAt) {
    user.otpHash = undefined;
    user.otpExpiresAt = undefined;
    await user.save();
    res.status(400);
    throw new Error("OTP expired");
  }

  const hashedOtp = hashOTP(otp);
  if (hashedOtp !== user.otpHash) {
    res.status(400);
    throw new Error("Invalid OTP");
  }

  // OTP verified successfully
  user.otpHash = undefined;
  user.otpExpiresAt = undefined;
  await user.save();

  const token = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    token,
    user: {
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
    },
  });
});

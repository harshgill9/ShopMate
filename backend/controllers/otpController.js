import dotenv from "dotenv";
dotenv.config();
import asyncHandler from "express-async-handler";
import nodemailer from "nodemailer";

// ✅ In-memory OTP store (production me DB/Redis use karo)
let otpStore = {};

// ✅ OTP generate karne ka helper
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// ✅ Email transporter (Gmail SMTP)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ OTP bhejne ka controller
export const sendOtpController = asyncHandler(async (req, res) => {
    console.log("📩 sending OTP:", req.body);
  const { email } = req.body; 

  if (!email) {
    console.log("❌ Email missing in request body");
    res.status(400);
    throw new Error("Email is required to send OTP.");
  }

  // ✅ OTP generate
  const otp = generateOTP();
  otpStore[email] = otp; 

  // ✅ Mail options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "🔐 Your OTP Code",
    html: `
      <h3>Here is your OTP code</h3>
      <p><strong>${otp}</strong></p>
      <p>This code will expire in 5 minutes.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ OTP sent to:", email);

    res.status(200).json({
      success: true,
      message: `OTP sent to ${email}`,
    });
  } catch (error) {
    console.error("❌ Email error:", error.message);
    res.status(500);
    throw new Error("Failed to send OTP.");
  }
});

// ✅ OTP verify karne ka controller
export const verifyOtpController = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    res.status(400);
    throw new Error("Email and OTP are required.");
  }

  // ✅ Check OTP
  if (otpStore[email] && otpStore[email] === otp) {
    delete otpStore[email]; // OTP used → clear
    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } else {
    res.status(400);
    throw new Error("Invalid or expired OTP.");
  }
});

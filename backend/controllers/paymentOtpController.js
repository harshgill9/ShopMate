import asyncHandler from "express-async-handler";
import { generateOTP, hashOTP } from "../utils/otp.js";
import nodemailer from "nodemailer";
import User from "../models/User.js";
import Payment from "../models/Payment.js";
import dotenv from "dotenv";

dotenv.config();

// Setup nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Send OTP for Payment
export const sendPaymentOtp = asyncHandler(async (req, res) => {
  const { email, mobile, method } = req.body;

  if (!email || !method) {
    return res.status(400).json({
      success: false,
      message: "Email and payment method are required",
    });
  }

  const safeMethod = method.toLowerCase();
  const validMethods = ["card", "upi", "wallet", "paytm", "amazon", "netbanking", "cod"];

  if (!validMethods.includes(safeMethod)) {
    return res.status(400).json({
      success: false,
      message: "Invalid payment method",
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Generate OTP and hash it
  const otp = generateOTP();
  const hashedOtp = hashOTP(otp);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

  // Save OTP hash and expiry on user document
//   user.otpHash = hashedOtp;
//   user.otpExpiresAt = expiresAt;
//   await user.save();

  // Create Payment record without saving OTP in it
  const newPayment = await Payment.create({
    user: user._id,
    email,
    method: safeMethod,
    mobile: mobile || "",
    status: "otp_sent",
    otpHash: hashedOtp,      
    otpExpiresAt: expiresAt,
  });

  // Send OTP via email
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Payment OTP",
      html: `<h3>Your OTP:</h3><p><strong>${otp}</strong></p><p>This OTP will expire in 5 minutes.</p>`,
    });
  } catch (error) {
    // In case of email sending failure, delete the created payment to avoid dangling records
    await Payment.findByIdAndDelete(newPayment._id);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP email",
      error: error.message,
    });
  }

  res.status(200).json({
    success: true,
    message: "OTP sent to your email",
    paymentId: newPayment._id,
  });
});

// Verify OTP for Payment
export const verifyPaymentOtp = asyncHandler(async (req, res) => {
  const { email, otp, paymentId } = req.body;

  if (!email || !otp || !paymentId) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  const payment = await Payment.findById(paymentId);
    
    if (!payment) {
        return res.status(404).json({ success: false, message: "Payment not found" });
    }
  if (payment.status !== "otp_sent" || !payment.otpHash || !payment.otpExpiresAt) {
    return res.status(400).json({ success: false, message: "OTP not generated" });
  }

  if (new Date() > payment.otpExpiresAt) {
    return res.status(400).json({ success: false, message: "OTP expired" });
  }

  // Compare hashes for OTP verification
  if (hashOTP(otp) !== payment.otpHash) {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }

//   const payment = await Payment.findById(paymentId);
//   if (!payment) {
//     return res.status(404).json({ success: false, message: "Payment not found" });
//   }

  // Update payment status to verified
  payment.status = "verified";
   payment.otpHash = undefined;
    payment.otpExpiresAt = undefined;
  await payment.save();

  // Clear OTP data from user document
//   user.otpHash = undefined;
//   user.otpExpiresAt = undefined;
//   await user.save();

  res.status(200).json({
    success: true,
    message: "Payment verified successfully",
  });
});

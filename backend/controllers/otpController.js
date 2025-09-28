// import asyncHandler from "express-async-handler";
// import User from "../models/User.js";
// import { generateOTP, hashOTP } from "../utils/otp.js";
// import nodemailer from "nodemailer";
// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
// import bcrypt from "bcryptjs";

// dotenv.config();

// // ✅ Email transporter
// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
//   tls: {
//     rejectUnauthorized: false, 
//   },
// });

// // ✅ Send OTP
// export const sendOtpController = asyncHandler(async (req, res) => {
//   const { email } = req.body;

//   if (!email) {
//     return res.status(400).json({ success: false, message: "Email is required" });
//   }

//   const user = await User.findOne({
//     email: { $regex: new RegExp(`^${email}$`, "i") },
//   });

//   if (!user) {
//     return res.status(404).json({ success: false, message: "User not found" });
//   }

//   const otp = generateOTP();
//   const hashedOtp = hashOTP(otp);
//   const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

//   user.otpHash = hashedOtp;
//   user.otpExpiresAt = expiresAt;
//   await user.save();

//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: "Your OTP Code",
//     html: `
//       <h3>Your OTP</h3>
//       <p><strong>${otp}</strong></p>
//       <p>This code will expire in 5 minutes.</p>
//     `,
//   };

//   await transporter.sendMail(mailOptions);

//   res.status(200).json({ success: true, message: `OTP sent to ${email}` });
// });

// // ✅ Verify OTP and login
// export const verifyOtpController = asyncHandler(async (req, res) => {
//   const { email, otp } = req.body;

//   if (!email || !otp) {
//     return res.status(400).json({ success: false, message: "Email and OTP are required" });
//   }

//   const user = await User.findOne({
//     email: { $regex: new RegExp(`^${email}$`, "i") },
//   });

//   if (!user || !user.otpHash || !user.otpExpiresAt) {
//     return res.status(400).json({ success: false, message: "OTP not requested" });
//   }

//   if (new Date() > user.otpExpiresAt) {
//     user.otpHash = undefined;
//     user.otpExpiresAt = undefined;
//     await user.save();
//     return res.status(400).json({ success: false, message: "OTP expired" });
//   }

//   const hashedOtp = hashOTP(otp);
//   if (hashedOtp !== user.otpHash) {
//     return res.status(400).json({ success: false, message: "Invalid OTP" });
//   }

//   // OTP success
//   user.otpHash = undefined;
//   user.otpExpiresAt = undefined;
//   await user.save();

//   const token = jwt.sign(
//     { userId: user._id, email: user.email, role: user.role },
//     process.env.JWT_SECRET,
//     { expiresIn: "7d" }
//   );

//   res.status(200).json({
//     success: true,
//     message: "Logged in successfully",
//     token,
//     user: {
//       id: user._id,
//       email: user.email,
//       username: user.username,
//       role: user.role,
//     },
//   });
// });

// // ✅ Login with Username + Password, then send OTP to registered email
// export const loginWithOtpController = asyncHandler(async (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({ success: false, message: "Username and password are required" });
//   }

//   const user = await User.findOne({ username });

//   if (!user) {
//     return res.status(404).json({ success: false, message: "User not found" });
//   }

//   // ✅ Password check with bcrypt
//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) {
//     return res.status(401).json({ success: false, message: "Invalid password" });
//   }

//   // ✅ OTP Generate
//   const otp = generateOTP();
//   const hashedOtp = hashOTP(otp);
//   const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

//   user.otpHash = hashedOtp;
//   user.otpExpiresAt = expiresAt;
//   await user.save();

//   // ✅ Send mail to registered email
//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: user.email,
//     subject: "Your OTP Code",
//     html: `
//       <h3>Your OTP</h3>
//       <p><strong>${otp}</strong></p>
//       <p>This code will expire in 5 minutes.</p>
//     `,
//   };

//   await transporter.sendMail(mailOptions);

//   res.status(200).json({ success: true, message: "OTP sent to your registered email" });
// });

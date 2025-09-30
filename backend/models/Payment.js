// models/Payment.js

import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
   email: { 
    type: String, 
    required: true 
 },
  method: {
    type: String,
    enum: ["card", "upi", "wallet", "paytm", "amazon", "netbanking", "cod"],
    required: true,
  },
  mobile: {
    type: String,
  },
  status: {
    type: String,
    enum: ["otp_sent", "verified", "failed", "pending"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  otpHash: {
    type: String, 
    // required: true, 
  },
  otpExpiresAt: {
    type: Date, 
  },
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;

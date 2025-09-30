import express from "express";
import {
  sendPaymentOtp,
  verifyPaymentOtp,
} from "../controllers/paymentOtpController.js";

const router = express.Router();

router.post("/send-payment-otp", sendPaymentOtp);
router.post("/verify-payment-otp", verifyPaymentOtp);

export default router;

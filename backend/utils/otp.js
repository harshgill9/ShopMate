import crypto from "crypto";

// Generate 6-digit OTP as string
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Hash OTP securely with SHA256
export const hashOTP = (otp) => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};

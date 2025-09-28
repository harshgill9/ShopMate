import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: { rejectUnauthorized: false },
});

transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_USER,  // apna email test karne ke liye
  subject: "Test Email from Nodemailer",
  text: "Yeh ek test email hai nodemailer se.",
}).then(() => {
  console.log("Test mail sent successfully");
  process.exit(0);
}).catch((err) => {
  console.error("Error sending test mail:", err);
  process.exit(1);
});

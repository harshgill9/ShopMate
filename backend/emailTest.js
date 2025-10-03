import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Transporter setup
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Optional, in case of self-signed certs
  },
});

// Verify SMTP connection
transporter.verify((err, success) => {
  if (err) {
    console.error("SMTP connection failed:", err);
  } else {
    console.log("SMTP is ready to send emails ✅");

    // Send test email
    transporter.sendMail({
      from: `"OTP Tester" <${process.env.EMAIL_USER}>`,
      to: process.env.TO_EMAIL,
      subject: "Test OTP Email",
      html: `<h2>This is a test email from your ShopMate backend</h2>
             <p><strong>OTP:</strong> ${Math.floor(100000 + Math.random() * 900000)}</p>`,
    })
    .then((info) => {
      console.log("✅ Email sent:", info.response);
    })
    .catch((err) => {
      console.error("❌ Failed to send email:", err);
    });
  }
});

import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: process.env.TO_EMAIL, // recipient
  from: process.env.EMAIL_FROM, // verified sender
  subject: "SendGrid Web API Email",
  html: "<strong>Hello from SendGrid Web API 👋</strong>",
};

sgMail.send(msg)
  .then(() => {
    console.log("✅ Email sent successfully via SendGrid Web API!");
  })
  .catch((error) => {
    console.error("❌ Error sending email:", error.response?.body || error.message);
  });

// Helper function to send emails
// Kindly add your Gmail credentials in .env file as shown in .env.example


// Imports
import ejs from "ejs";
import path from "path";
import nodemailer from "nodemailer";

// Create transporter to send emails with Gmail configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Render templates - functions that render the HTML(from ejs files) present in src/mail folder

export async function renderOtpTemplate(data: {           // OTP template
  otp: string;
  expiry: number;
}) {
  const templatePath = path.join(
    process.cwd(),
    "src",
    "mail",
    "mail.ejs"
  );

  return ejs.renderFile(templatePath, data);
}
export async function renderWelcomeBuyerTemplate(data: {  // Buyer Welcome mail template
  name:string,
  role: string
}) {
  const templatePath = path.join(
    process.cwd(),
    "src",
    "mail",
    "welcome-buyer.ejs"
  );

  return ejs.renderFile(templatePath, data);
}
export async function renderWelcomeSellerTemplate(data: {     // Seller Welcome mail template
  name:string,
  role: string
}) {
  const templatePath = path.join(
    process.cwd(),
    "src",
    "mail",
    "welcome-seller.ejs"
  );

  return ejs.renderFile(templatePath, data);
}
export async function renderForgotPasswordTemplate(data: {      // Forgot Password OTP mail template
  otp: string;
  expiry: number;
  name: string;
  link: string;
}) {
  const templatePath = path.join(
    process.cwd(),
    "src",
    "mail",
    "forgot-password.ejs"
  );

  return ejs.renderFile(templatePath, data);
}

export async function sendEmail(to: string, html: string, subject?: string) {   // Function responsible for sending emails
  await transporter.sendMail({
    from: `Boxes n Bottles <${process.env.GMAIL_EMAIL}>`,
    to: to,
    subject: subject ?? "Click to view your OTP",
    html: html,
  });
}

import ejs from "ejs";
import path from "path";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function renderOtpTemplate(data: {
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

export async function sendOtpEmail(to: string, html: string) {
  await transporter.sendMail({
    from: `BNB Services <${process.env.GMAIL_EMAIL}>`,
    to: to,
    subject: "Your OTP Code",
    html: html,
  });
}

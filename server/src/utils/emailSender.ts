
import nodemailer from "nodemailer";
import { ApiError } from "../errors/ApiErrors";
import {Resend} from "resend"


interface EmailServiceData {
  to: string;
  subject: string;
  token: string;
}

export const sendVerificationEmail = async ({ to, subject, token }: EmailServiceData) => {
  const html = `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
  <div style="max-width: 480px; margin: 0 auto; padding: 24px;">

    <h2 style="margin-bottom: 16px;">Verify your email</h2>

    <p>Thanks for signing up! 🎉</p>

    <p style="margin: 20px 0;">
      Please confirm your email address by clicking the button below.
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.CLIENT_URL || "http://localhost:3001"}/api/verification/verify-email?token=${token}"
        style="
          background-color: #16a34a;
          color: white;
          padding: 12px 20px;
          text-decoration: none;
          border-radius: 6px;
          display: inline-block;
          font-weight: bold;
        ">
        Verify Email
      </a>
    </div>

    <p style="font-size: 12px; color: #666;">
      If you didn’t create this account, you can ignore this email.
    </p>

  </div>
</div>
`;

    
const resend = new Resend(process.env.RESEND_API_KEY);

// const from = process.env.EMAIL_FROM || "Acme <onboarding@resend.dev>";
const from = process.env.EMAIL_FROM || "Budget Manager App <budgetapp@resend.dev>";

const { data, error } = await resend.emails.send({
  from,
  to,
  subject,
  html,
});

if (error) {
  console.error("Error sending email:", error);
  process.exit(1);
}

console.log("Email sent successfully!");
console.log("Email ID:", data?.id);
};

export const sendPasswordResetEmail = async ({ to, subject, token }: EmailServiceData) => {

  console.log("IN RESEND ")

  const html = `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
  <div style="max-width: 480px; margin: 0 auto; padding: 24px;">
    
    <h2 style="margin-bottom: 16px;">Reset your password</h2>

    <p>You requested to reset your password.</p>

    <p style="margin: 20px 0;">
      Click the button below to continue. This link will expire soon for security reasons.
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password?token=${token}"
        style="
          background-color: #2563eb;
          color: white;
          padding: 12px 20px;
          text-decoration: none;
          border-radius: 6px;
          display: inline-block;
          font-weight: bold;
        ">
        Reset Password
      </a>
    </div>

    <p style="font-size: 12px; color: #666;">
      If you didn’t request this, you can safely ignore this email.
    </p>

  </div>
</div>
`;

const resend = new Resend(process.env.RESEND_API_KEY);

const from = process.env.RESEND_EMAIL_FROM || "Acme <onboarding@resend.dev>";

const { data, error } = await resend.emails.send({
  from,
  to,
  subject,
  html,
});

if (error) {
  console.error("Error sending email:", error);
  process.exit(1);
}

console.log("Email sent successfully!");
console.log("Email ID:", data?.id);
};
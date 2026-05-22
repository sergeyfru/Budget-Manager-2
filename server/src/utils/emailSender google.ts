import nodemailer from "nodemailer";
import { ApiError } from "../errors/ApiErrors";
// import client from "twilio"

const transporter = nodemailer.createTransport({
  // service: "Gmail",
  host: "smtp.gmail.com",

  port: 587,

  secure: false,
  // tls:{},

  tls: { family: 4 } as any, // Force IPv4

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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

  try {
    await transporter.sendMail({
      from: `"Budget Manager App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw new ApiError(500, "Failed to send email");
  }
};

export const sendPasswordResetEmail = async ({ to, subject, token }: EmailServiceData) => {
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

  try {
    await transporter.sendMail({
      from: `"Budget Manager App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw new ApiError(500, "Failed to send email");
  }
};

// export const sendSMS = async (to: string, body: string) => {
//   const twilioClient = client(process.env.TWILIO_SID!, process.env.TWILIO_AUTH_TOKEN!);
//   try {
//     await twilioClient.messages.create({
//       body,
//       from: process.env.TWILIO_PHONE_NUMBER!,
//       to,
//     });
//   } catch (error) {
//     console.error("Error sending SMS:", error);
//     throw new ApiError(500, "Failed to send SMS");
//   }};

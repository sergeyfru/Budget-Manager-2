import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { ApiError } from "../errors/ApiErrors";
// import client from "twilio"

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {

  try {
    await transporter.sendMail({
      from: `"Budget Manager App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
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
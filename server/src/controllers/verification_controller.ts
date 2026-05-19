import { ResSimple, ResVerificationStatus } from "@shared/core";
import { Request, Response } from "express";
import { resend_verification_email, check_email_verification, verify_email } from "../models/verification_model";

export const _verify_email = async (req: Request, res: Response<ResSimple>) => {
  const token = req.query.token as string;
  console.log("Verification token:", token);
  try {
    const result = await verify_email(token);
    res.status(200).json({ status: "success", message: "Email verified successfully" });
  } catch (error: any) {
    console.log("Error in verify email:", error);

    res.status(error.status || 500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const _resend_verification_email = async (req: Request, res: Response<ResSimple>) => {
  try {
    const { email } = req.body as { email: string };

    await resend_verification_email(email);

    res.status(200).json({
      status: "success",
      message: "Verification email resent successfully. Please check your inbox.",
    });
  } catch (error: any) {
    console.log("Error in resend verification email:", error);
    res.status(error.status || 500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const _check_email_verification = async (req: Request, res: Response<ResVerificationStatus>) => {
  const email = req.query.email as string;
  console.log(email);

  try {
    const response = await check_email_verification(email);
    console.log(response);
    const textStatus = response.email_verified ? "Email verified." : "Email not verified yet.";

    res.status(200).json({
      status: "success",
      message: textStatus,
      data: { email_verified: response.email_verified },
    });
  } catch (error: any) {
    console.log("Error in check email verification:", error);
    res.status(error.status || 500).json({
      status: "error",
      message: error.message,
    });
  }
};

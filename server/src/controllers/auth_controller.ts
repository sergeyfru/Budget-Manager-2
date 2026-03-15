import { Request, Response } from "express";
import { ReqRegisterSchema, ReqLoginSchema } from "../schemas/user_auth_schema";
import { changePassword, login, register, verify_email } from "../models/auth_model";
import { ApiError } from "../errors/ApiErrors";
import dotenv from "dotenv";
dotenv.config();
// const UAParser = require("ua-parser-js");

export const _login = async (req: Request, res: Response) => {
  const ip_address = req.ip || "Unknown IP";
  const device_name = req.get("User-Agent") || "Unknown Device";
  // const ua = new UAParser(req.get("User-Agent"));
  console.log("IP Address:", ip_address);

  const { email, password } = req.body as ReqLoginSchema;

  try {
    const result = await login(email, password, ip_address, device_name);
    if (result instanceof ApiError) {
      res.status(result.status).json({ error: result.message });
      return;
    }
    const maxAge_short = process.env.JWT_EXPIRES_SHORT
      ? parseInt(process.env.JWT_EXPIRES_SHORT)
      : 60000 * 15; // default to 15 minutes
    const maxAge_long = process.env.JWT_EXPIRES_LONG
      ? parseInt(process.env.JWT_EXPIRES_LONG)
      : 3600000 * 24 * 7; // default to 7 days

    console.log("Max Age Short:", maxAge_short);
    console.log("Max Age Long:", maxAge_long);

    const { user, access_token, refresh_token } = result;
    res.cookie("access_token", access_token, {
      httpOnly: true,
      secure: false, // for development, set to true in production
      sameSite: "strict",
      maxAge: maxAge_short
    });
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: false, // for development, set to true in production
      sameSite: "strict",
        maxAge: maxAge_long
    });

    res.send(user);
  } catch (error: any) {
    res.status(error.status || 500).json({
      error: error.message,
    });
  }
};

export const _register = async (req: Request, res: Response) => {
  const data = req.body as ReqRegisterSchema;
  console.log("_register data:", data);
  try {
    const user = await register(data);
    res.send(user);
  } catch (error: any) {
    res.status(error.status || 500).json({
      error: error.message,
    });
  }
};

export const _changePassword = async (req: Request, res: Response) => {
  const user_id = (req as any).user_id;
  const { old_password, new_password } = req.body;
  const changePasswordResult = await changePassword(
    user_id,
    old_password,
    new_password,
  );
  if (changePasswordResult instanceof ApiError) {
    res
      .status(changePasswordResult.status)
      .json({ error: changePasswordResult.message });
    return;
  }
  res.send("Password changed successfully");
};

export const _logout = async (req: Request, res: Response) => {
  console.log("In _logout controller");

  res.clearCookie("access_token");
  res.clearCookie("refresh_token");

  res.send("You have been logged out successfully");
};
export const _veriyfy_email = async (req: Request, res: Response) => {
  const token = req.query.token as string;
  console.log("Verification token:", token);

  const result = await verify_email(token);
  if (result instanceof ApiError) {
    res.status(result.status).json({ error: result.message });
    return;
  } 

  res.send({ msg: "Email verified successfully" });
};

export const _verify_phone_number = async (req: Request, res: Response) => {
  res.send("Verify Phone Number");
};

export const _refresh = (req: Request, res: Response) => {
  const token = req.cookies.access_token;
  console.log("Token from cookie:", token);
  res.send("Refresh");
};

export const _forgotPassword = (req: Request, res: Response) => {
  res.send("Forgot Password");
};

export const _resetPassword = (req: Request, res: Response) => {
  res.send("Reset Password");
};

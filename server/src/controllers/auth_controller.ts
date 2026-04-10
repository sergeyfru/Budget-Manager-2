import { Request, Response } from "express";
import { changePassword, login, logout, refresh, register, verify_email } from "../models/auth_model";
import { hashedRefreshToken, maxAgeRefresh } from "../utils/token";
import {
  ReqLogin, ReqRegister,
  ResLogin, ResRefresh,
  ResRegister, ResSimple 
} from "@shared/core";
// const UAParser = require("ua-parser-js");

export const _login = async (req: Request, res: Response<ResLogin>) => {
  const ip_address = req.ip || "Unknown IP";
  const device_name = req.get("User-Agent") || "Unknown Device";
  console.log("IP Address:", ip_address);
  console.log("Device Name:", device_name);

  const { email, password } = req.body as ReqLogin;

  try {
    const result = await login(email, password, ip_address, device_name);
    // if (result instanceof ApiError) {
    //   res.status(result.status)
    //     .json({ status: "error", message: result.message });
    //   return;
    // }

    const { user, access_token, refresh_token } = result;

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: false, // for development, set to true in production
      sameSite: "strict",
      maxAge: maxAgeRefresh * 1000, // convert to milliseconds
    });

    res.status(201).json({
      data: { user, access_token },
      status: "success",
      message: "Login successful",
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      status: "error",
      message: error.message || "An unexpected error occurred during login",
    });
  }
};

export const _register = async (req: Request, res: Response<ResRegister>) => {
  const data = req.body as ReqRegister;
  console.log("_register data:", data);
  try {
    const user = await register(data);
    res.status(201).json({ data: user, status: "success", message: "Created" });
  } catch (error: any) {
    res.status(error.status || 500).json({
      status: "error",
      message: error.message || "An unexpected error occurred during registration",
    });
  }
};

export const _changePassword = async (req: Request, res: Response<ResSimple>) => {
  const user_id = req.user.user_id;
  const { old_password, new_password } = req.body;
  await changePassword(user_id, old_password, new_password);

  res.status(200).json({
    status: "success",
    message: "Password changed successfully",
  });
};

export const _logout = async (req: Request, res: Response<ResSimple>) => {
  console.log("In _logout controller");
  const refresh_token = req.cookies.refresh_token || "";
  await logout(refresh_token);

  res.clearCookie("access_token");
  res.clearCookie("refresh_token");

  res.status(200).json({ status: "success", message: "You have been logged out successfully" });
};

export const _veriyfy_email = async (req: Request, res: Response<ResSimple>) => {
  const token = req.query.token as string;
  console.log("Verification token:", token);
  await verify_email(token);

  res.status(200).json({ status: "success", message: "Email verified successfully" });
};

export const _verify_phone_number = async (req: Request, res: Response<ResSimple>) => {
  res.status(200).json({ status: "success", message: "Phone number verified successfully" });
};

export const _refresh = async (req: Request, res: Response<ResRefresh>) => {
  const refreshToken = req.cookies.refresh_token;
  const hashed_refresh_token = hashedRefreshToken(refreshToken);
  const newTokens = await refresh(hashed_refresh_token);

  res.cookie("refresh_token", newTokens.refresh_token, {
    httpOnly: true,
    secure: false, // for development, set to true in production
    sameSite: "strict",
    maxAge: maxAgeRefresh * 1000, // convert to milliseconds
  });

  res.status(200).json({
    data: { access_token: newTokens.access_token },
    status: "success",
    message: "Tokens were refreshed successfully",
  });
};

export const _forgotPassword = (req: Request, res: Response<ResSimple>) => {
  res.status(200).json({ status: "success", message: "This is a placeholder for forgot password functionality" });
};

export const _resetPassword = (req: Request, res: Response<ResSimple>) => {
  res.status(200).json({ status: "success", message: "This is a placeholder for reset password functionality" });
};

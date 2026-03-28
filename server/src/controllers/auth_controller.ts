import {Request, Response } from "express";
import { ReqRegisterSchema, ReqLoginSchema } from "../schemas/user_auth_schema";
import {
  changePassword,
  login,
  logout,
  refresh,
  register,
  verify_email,
} from "../models/auth_model";
import { ApiError } from "../errors/ApiErrors";
import {  hashedRefreshToken, maxAgeRefresh } from "../utils/token";
// const UAParser = require("ua-parser-js");


export const _login = async (req: Request, res: Response) => {
  const ip_address = req.ip || "Unknown IP";
  const device_name = req.get("User-Agent") || "Unknown Device";
  console.log("IP Address:", ip_address);
  console.log("Device Name:", device_name);

  const { email, password } = req.body as ReqLoginSchema;

  try {
    const result = await login(email, password, ip_address, device_name);
    if (result instanceof ApiError) {
      res.status(result.status).json({ error: result.message });
      return;
    }

    const { user, access_token, refresh_token } = result;

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: false, // for development, set to true in production
      sameSite: "strict",
      maxAge: maxAgeRefresh,
    });

    // res.cookie("access_token", access_token, {
    //   httpOnly: true,
    //   secure: false, // for development, set to true in production
    //   sameSite: "strict",
    //   maxAge: maxAgeAccess,
    // });

    res
      .status(201)
      .json({
        user,
        access_token,
        status: "success",
        message: "Login successful",
      });
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
    res.status(201).json({ user, message: "Created" });
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
  res.status(200).json({
    status: "success",
    message: "Password changed successfully",
  });
};


export const _logout = async (req: Request, res: Response) => {
  console.log("In _logout controller");
  const refresh_token = req.cookies.refresh_token || "";
  await logout(refresh_token);

  res.clearCookie("access_token");
  res.clearCookie("refresh_token");

  res
    .status(200)
    .json({ success: true, message: "You have been logged out successfully" });
};


export const _veriyfy_email = async (req: Request, res: Response) => {
  const token = req.query.token as string;
  console.log("Verification token:", token);

  const result = await verify_email(token);
  if (result instanceof ApiError) {
    res.status(result.status).json({ error: result.message });
    return;
  }

  res
    .status(200)
    .json({ status: "success", message: "Email verified successfully" });
};


export const _verify_phone_number = async (req: Request, res: Response) => {
  res
    .status(200)
    .json({ status: "success", message: "Phone number verified successfully" });
};


export const _refresh = async (req: Request, res: Response) => {

  const refreshToken = req.cookies.refresh_token;
  const hashed_refresh_token = hashedRefreshToken(refreshToken);
  const newTokens = await refresh(hashed_refresh_token);

  res.cookie("refresh_token", newTokens.newRefreshToken, {
    httpOnly: true,
    secure: false, // for development, set to true in production
    sameSite: "strict",
    maxAge: maxAgeRefresh,
  });

  res
    .status(200)
    .json({
      access_token: newTokens.newAccessToken,
      status: "success",
      message: "Tokens were refreshed successfully",
    });
};


export const _forgotPassword = (req: Request, res: Response) => {
  res.status(200).json({ message: "Forgot Password" });
};


export const _resetPassword = (req: Request, res: Response) => {
  res.status(200).json({ message: "Reset Password" });
};

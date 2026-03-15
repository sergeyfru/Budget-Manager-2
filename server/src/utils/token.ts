import { log } from "console";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_SHORT = process.env.JWT_EXPIRES_SHORT
  ? parseInt(process.env.JWT_EXPIRES_SHORT)
  : 60 * 15 * 1000; // 15 minutes
const JWT_EXPIRES_LONG = process.env.JWT_EXPIRES_LONG
  ? parseInt(process.env.JWT_EXPIRES_LONG)
  : 60 * 60 * 24 * 7 * 1000; // 7 days
  

export const generateAccessToken = (
  payload: object,
  expiresIn: number = JWT_EXPIRES_SHORT,
): string => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  const access_token = jwt.sign(payload, JWT_SECRET, { expiresIn});
  console.log("Generated token:", access_token);

  return access_token;
};

export const generateRefreshToken = (): string => {
  const refresh_token = crypto.randomBytes(64).toString("hex");
  return refresh_token;
};

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    log("Verified token:", decoded);
    return decoded;
  } catch (error) {
    log("Token verification failed:", error);
    return null;
  }
};

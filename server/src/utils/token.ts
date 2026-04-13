import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto, { Hash } from "crypto";
// import dotenv from "dotenv";
import { ApiError } from "../errors/ApiErrors";
import { db } from "../config/db";
import { Request } from "express";
import { UserDB, userDBSchema } from "@shared/core";

// dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET!;

export const maxAgeAccess = process.env.JWT_EXPIRES_ACCESS
  ? parseInt(process.env.JWT_EXPIRES_ACCESS)
  : 60 * 15; // 15 minutes
export const maxAgeRefresh = process.env.JWT_EXPIRES_REFRESH
  ? parseInt(process.env.JWT_EXPIRES_REFRESH)
  : 60 * 60 * 24 * 7; // 7 days

export const generateAccessToken = (
  payload: object,
  expiresIn: number = maxAgeAccess,
): string => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  console.log(
    "Generating access token with payload:",
    payload,
    "and expiresIn:",
    expiresIn,
  );
  const access_token = jwt.sign(payload, JWT_SECRET, { expiresIn });

  return access_token;
};

export const getUserFromToken = async (
  access_token: string,
): Promise<UserDB> => {
  try {
    const decoded = jwt.verify(access_token, JWT_SECRET!);
    if (typeof decoded == "string" || !decoded.user_id || !decoded.exp) {
      throw new ApiError(401, "Unauthorized");
    }
    // console.log("Decoded token:", decoded);
    console.log(
      "Token expires in (seconds):",
      decoded.exp - Math.floor(Date.now() / 1000),
    );
    const responseFromDB = await db("users")
      .where("user_id", decoded.user_id)
      .first();

    const result = userDBSchema.safeParse(responseFromDB);
    if (!result.success) {
      console.log("Validation error:", result.error);
      throw new ApiError(404, result.error.message);
    }
    
    console.log("Get user with ID:", result.data.user_id);

    return result.data;
  } catch (error) {
    console.log("Error in getUserFromToken:", error);
    if (error instanceof JsonWebTokenError) {
      throw new ApiError(401, error.message);
    } else if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Server error during authentication");
  }
};

export const generateRefreshToken = (): string => {
  const refresh_token = crypto.randomBytes(64).toString("hex");
  return refresh_token;
};

export const hashedRefreshToken = (refresh_token: string): string => {
  const tokenHash = crypto
    .createHash("sha256")
    .update(refresh_token)
    .digest("hex");
  return tokenHash;
};

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Verified token:", decoded);
    return decoded;
  } catch (error) {
    console.log("Token verification failed:", error);
    return null;
  }
};

export const getCheckedUser = async (access_token: string) => {
  // const access_token = req.body.access_token as string || req.cookies.access_token as string;
  console.log(access_token);

  if (!access_token) {
    throw new ApiError(401, "Unauthorized");
  }

  const user = await getUserFromToken(access_token);

  return user;
};

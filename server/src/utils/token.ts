import { log } from "console";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto, { Hash } from "crypto";
// import dotenv from "dotenv";
import { ApiError } from "../errors/ApiErrors";
import { db } from "../config/db";
import { Request } from "express";
import { user_info_schema, UserInfoSchema } from "../schemas/user_auth_schema";

// dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_ACCESS = process.env.JWT_EXPIRES_ACCESS
  ? parseInt(process.env.JWT_EXPIRES_ACCESS)
  : 60 * 15 * 1000; // 15 minutes
const JWT_EXPIRES_REFRESH = process.env.JWT_EXPIRES_REFRESH
  ? parseInt(process.env.JWT_EXPIRES_REFRESH)
  : 60 * 60 * 24 * 7 * 1000; // 7 days

export const generateAccessToken = (
  payload: object,
  expiresIn: number = JWT_EXPIRES_ACCESS,
): string => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  const access_token = jwt.sign(payload, JWT_SECRET, { expiresIn });

  return access_token;
};

export const getUserFromToken = async (
  access_token: string,
): Promise<UserInfoSchema> => {
  try {
    const decoded = jwt.verify(access_token, process.env.JWT_SECRET!) ;
    if (typeof decoded == "string" || !decoded.user_id) {
      throw new ApiError(401, "Unauthorized");
    }
    const responseFromDB = await db("users").where("user_id", decoded.user_id).first();
console.log(responseFromDB);

    const result = user_info_schema.safeParse(responseFromDB);

    if (!result.success) {
      console.log(result.error);
      throw new ApiError(404, result.error.message);
    }
    return result.data;
  } catch (error) {
     if (error instanceof JsonWebTokenError) {
      throw new ApiError(401,'Token is not valid');
    }
    throw new ApiError(500,'Server error during authentication' );
  
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
    log("Verified token:", decoded);
    return decoded;
  } catch (error) {
    log("Token verification failed:", error);
    return null;
  }
};

export const getCheckedUser = async  (access_token: string) => {
    // const access_token = req.body.access_token as string || req.cookies.access_token as string;
    console.log(access_token);
    
    if (!access_token) {
      throw new ApiError(401,"Unauthorized");
    }

    const user = await getUserFromToken(access_token)

    return user
  };
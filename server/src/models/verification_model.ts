import { db } from "../config/db";
import { ApiError } from "../errors/ApiErrors";
import { dbErrorHandler } from "../errors/db_errors";
import { generateAccessToken } from "../utils/token";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "../utils/verification";
import { validateDB } from "../utils/validation";
import { userDBSchema } from "@shared/core";
import jwt from "jsonwebtoken";

export const verify_email = async (token: string): Promise<boolean> => {
  const trx = await db.transaction();

  try {
    const decoded = jwt.decode(token);

    if (!decoded || typeof decoded === "string") {
      throw new ApiError(400, "Invalid token");
    }

    const user_id = decoded.user_id;

    const user = await trx("users").where({ user_id }).first();

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.email_verified) {
      await trx.commit();
      throw new ApiError(409, "Email already verified");
    }

    const tokenRecord = await trx("email_verification_tokens").where({ user_id, used: false }).first();

    if (!tokenRecord) {
      throw new ApiError(404, "Verification token not found");
    }

    if (tokenRecord.expires_at < new Date()) {
      throw new ApiError(400, "Verification token expired");
    }

    console.log("Token is not expired");

    const isTokenValid = await bcrypt.compare(token, tokenRecord.token_hash);

    console.log("isTokenValid",isTokenValid);
    

    if (!isTokenValid) {
      throw new ApiError(400, "Invalid verification token");
    }

    await trx("users").where({ user_id }).update({ email_verified: true, is_active: true });

    await trx("email_verification_tokens").where({ user_id }).update({ used: true });

    await trx.commit();
    return true;
  } catch (error) {
    await trx.rollback();
    throw dbErrorHandler(error);
  }
};

export const resend_verification_email = async (email: string) => {
  const trx = await db.transaction();
  try {
    const user = await trx({ u: "users" })
      // .innerJoin({ evt: "email_verification_tokens" }, "u.user_id", "evt.user_id")
      .where({ "u.email": email })
      .first();
    if (user && user.email_verified) {
      throw new ApiError(409, "Email already verified");
    }

    if (user && Date.now() - user.last_email_verification_sent < 60000) {
      throw new ApiError(429, "Verification email already sent. Please wait before requesting another one.");
    }
    if (user) {
      const salt = await bcrypt.genSalt(10);
      const email_verification_token = generateAccessToken({ user_id: user.user_id }, 60 * 60 * 1000); // 1 hour expiration
      const token_hash = await bcrypt.hash(email_verification_token, salt);
      console.log("Token created and hashed");

      await trx("email_verification_tokens")
        // .where({ user_id: user.user_id })
        .insert({
          user_id: user.user_id,
          token_hash,
          expires_at: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
          used: false,
          created_at: new Date(Date.now()),
        });

      console.log("Email verification token inserted");

      await trx("users")
        .where({ user_id: user.user_id })
        .update({ last_email_verification_sent: new Date(), updated_at: new Date() });

      console.log("Email verification token created for user:", user.user_id);

      await sendVerificationEmail({
        to: user.email,
        subject: "Verify your email",
        token: email_verification_token,
      });
      console.log("Verification email sent");
    }

    trx.commit();
    // return;
  } catch (error) {
    console.log(error);
    trx.rollback();
    throw dbErrorHandler(error);
  }
};

export const check_email_verification = async (email: string) => {
  console.log("in check model");

  try {
    const responseFromDB = await db("users").where({ email }).first();

    const user = validateDB(userDBSchema, responseFromDB);

    console.log("User is existing in DB with email:", email);

    return { email_verified: user.email_verified };
  } catch (error) {
    console.log(error);

    throw dbErrorHandler(error);
  }
};

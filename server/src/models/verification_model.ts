import { db } from "../config/db";
import { ApiError } from "../errors/ApiErrors";
import { dbErrorHandler } from "../errors/db_errors";
import { generateRefreshToken, hashedRefreshToken, maxAgeAccess } from "../utils/token";
import { sendVerificationEmail } from "../utils/emailSender";
import { validateDB } from "../utils/validation";
import { userDBSchema } from "@shared/core";

export const verify_email = async (token: string): Promise<boolean> => {
  const trx = await db.transaction();

  try {
    const token_hash = hashedRefreshToken(token);

    const tokenRecord = await trx("email_verification_tokens").where({ token_hash, used: false }).first();
    console.log("Token record from DB:", tokenRecord);

    if (!tokenRecord) {
      throw new ApiError(404, "Verification token not found or invalid. Please request a new verification email.");
    }

    if (tokenRecord.expires_at < new Date()) {
      throw new ApiError(400, "Verification token expired");
    }

    await trx("users").where({ user_id: tokenRecord.user_id }).update({ email_verified: true, is_active: true });

    await trx("email_verification_tokens").where({ user_id: tokenRecord.user_id }).update({ used: true });

    await trx.commit();
    return true;
  } catch (error) {
    console.error("Error in verify_email:", error);
    await trx.rollback();
    throw dbErrorHandler(error);
  }
};

export const resend_verification_email = async (email: string) => {
  const trx = await db.transaction();
  try {
    const user = await trx({ u: "users" }).where({ "u.email": email }).first();

    if (user && user.email_verified) {
      throw new ApiError(409, "Email already verified");
    }

    if (user && Date.now() - user.last_email_verification_sent < 60000) {
      throw new ApiError(429, "Verification email already sent. Please wait before requesting another one.");
    }

    await trx("email_verification_tokens").where({ user_id: user.user_id, used: false }).update({ used: true });

    if (user) {
      const email_verification_token = generateRefreshToken();
      const token_hash = hashedRefreshToken(email_verification_token);
      console.log("Token created and hashed");

      await trx("email_verification_tokens").insert({
        user_id: user.user_id,
        token_hash,
        expires_at: new Date(Date.now() + maxAgeAccess), // 15 minutes from now
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
  try {
    const responseFromDB = await db("users").where({ email }).first();

    const user = validateDB(userDBSchema, responseFromDB);

    return { email_verified: user.email_verified };
  } catch (error) {
    console.log(error);

    throw dbErrorHandler(error);
  }
};

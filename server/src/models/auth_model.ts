import { db } from "../config/db";
import bcrypt from "bcryptjs";
import { RefreshTokenDBSchema, ReqRegisterSchema, UserInfoSchema } from "../schemas/user_auth_schema";
import { dbErrorHandler } from "../errors/db_errors";
import { ApiError } from "../errors/ApiErrors";
import { generateAccessToken, generateRefreshToken, hashedRefreshToken } from "../utils/token";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/verification";

export const login = async (
  email: string,
  password: string,
  ip_address: string,
  device_name: string,
): Promise<
  | { user: UserInfoSchema; access_token: string; refresh_token: string }
  | ApiError
> => {
  const trx = await db.transaction();
  try {
    const user = await trx({ u: "users" })
      .innerJoin({ ua: "users_auth" }, "u.user_id", "ua.user_id")
      .where({ "u.email": email })
      .first();
    // console.log(user);

    if (!user) {
      throw new ApiError(404, "User not found");
    } else {
      const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash,
      );
      if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password");
      }
    }

    const refresh_token = generateRefreshToken();
 //       #  for version 2, we will store refresh tokens in the database and associate them with sessions


    // const hashed_refresh_token = await bcrypt.hash(refresh_token, 10);
    // const expires_at = new Date(
    //   Date.now() +
    //     (process.env.JWT_EXPIRES_REFRESH
    //       ? parseInt(process.env.JWT_EXPIRES_REFRESH) * 1000
    //       : 1000 * 60 * 60 * 24 * 7),
    // );

    // console.log(expires_at);

    // const [session] = await trx("sessions")
    //   .insert({ user_id: user.user_id, ip_address, device_name, expires_at })
    //   .returning(["session_id", "ip_address", "device_name"]);

    // await trx("refresh_tokens").insert({
    //   user_id: user.user_id,
    //   session_id: session.session_id,
    //   hashed_refresh_token,
    //   expires_at,
    // });
    const access_token = generateAccessToken({ user_id: user.user_id  });

    delete user.password_hash;
    delete user.user_auth_id;

    trx.commit();

    return { user, access_token, refresh_token };

  } catch (error) {
    trx.rollback();
    return dbErrorHandler(error);
  }
};

export const register = async (fullUser: ReqRegisterSchema) => {
  const { password, confirm_password, ...userInfo } = fullUser;

  const trx = await db.transaction();
  try {
    const existingUser = await trx("users")
      .where({ email: userInfo.email })
      .first();
    if (existingUser) {
      trx.rollback();
      throw new ApiError(409, "Duplicate value");
    }
    const [user] = await trx("users")
      .insert(userInfo)
      .returning([
        "user_id",
        "first_name",
        "last_name",
        "email",
        "phone_number",
        "email_verified",
        "phone_verified",
        "is_active",
        "created_at",
        "updated_at",
      ]);
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    await trx("users_auth").insert({
      user_id: user.user_id,
      password_hash,
    });

    const email_verification_token = generateAccessToken({ user_id: user.user_id }, 60 * 60 * 1000); // 1 hour expiration
    const token_hash = await bcrypt.hash(email_verification_token, salt);
    await trx("email_verification_tokens").insert({
      user_id: user.user_id,
      token_hash,
      expires_at: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
    });

    await sendEmail(
      user.email,
      "Verify your email",
      `<p>Please click <a href="${process.env.CLIENT_URL}/verify-email?token=${email_verification_token}">here</a> to verify your email.</p>`
    );


    await trx.commit();
    return user as UserInfoSchema;
  } catch (error) {
    await trx.rollback();
    dbErrorHandler(error);
  }
};
export const changePassword = async (user_id: string, old_password: string, new_password: string): Promise<boolean | ApiError> => {
  const trx = await db.transaction();
  try {
    const userAuth = await trx("users_auth").where({ user_id }).first();
    if (!userAuth) {
      throw new ApiError(404, "User not found");
    }
    const isOldPasswordValid = await bcrypt.compare(
      old_password,
      userAuth.password_hash,
    );
    if (!isOldPasswordValid) {
      throw new ApiError(401, "Invalid old password");
    }
    const salt = await bcrypt.genSalt(10);
    const new_password_hash = await bcrypt.hash(new_password, salt);
    await trx("users_auth").where({ user_id }).update({ password_hash: new_password_hash });
    await trx.commit();
    return true;

  } catch (error) {
    await trx.rollback();
    throw dbErrorHandler(error);
  }
};

export const logout = async (refresh_token: string, session_id: string | null = null ) : Promise<boolean> => {
const trx = await db.transaction();
try {
  if(refresh_token){
  const hashed_refresh_token = hashedRefreshToken(refresh_token)
  await trx("refresh_tokens").where({ hashed_refresh_token }).delete();
  
  }
  
  await trx.commit()
  return true;
} catch (error) {
trx.rollback();
throw dbErrorHandler(error);  
}

};


export const verify_email = async (token: string) : Promise<boolean | ApiError> => {
  const trx = await db.transaction();
  const decoded = jwt.decode(token);
  if (!decoded || typeof decoded === "string") {
    trx.rollback();
    throw new ApiError(400, "Invalid token");
  }
  const user_id = decoded.user_id;

  try {
    const tokenRecord = await trx("email_verification_tokens")
      .where({ user_id })
      .first();
      
    if (!tokenRecord) {
      trx.rollback();
      throw new ApiError(404, "Verification token not found");
    }
    if (tokenRecord.expires_at < new Date()) {
      trx.rollback();
      throw new ApiError(400, "Verification token expired");
    }
    const isTokenValid = await bcrypt.compare(token, tokenRecord.token_hash);
    if (!isTokenValid) {
      trx.rollback();
      throw new ApiError(400, "Invalid verification token");
    }

    await trx("users").where({ user_id }).update({ email_verified: true });
    await trx("email_verification_tokens").where({ user_id }).del();

    await trx.commit(); 
    return true;
}catch (error) {
  await trx.rollback();
  throw dbErrorHandler(error);
}
};





export const refresh = async (hashed_refresh_token:string ) => {
  const trx =  await db.transaction()
try {
  const dbResponse : RefreshTokenDBSchema = await trx('refresh_tokens').where({hashed_refresh_token}).first()
  if(!dbResponse){
    throw new ApiError(401, 'Invalid refresh token')
  }

  const newRefreshToken = generateRefreshToken()
  const hashedNewRefreshToken = hashedRefreshToken(newRefreshToken)
  await trx('refresh_tokens').insert({'hased_refresh_token': hashedNewRefreshToken})
  await trx('refresh_tokens').where({'token_id':dbResponse.token_id}).delete()

  const newAccessToken = generateAccessToken({user_id:dbResponse.user_id})

  return{newRefreshToken, newAccessToken}
  
  } catch (error) {
  await trx.rollback();
  throw dbErrorHandler(error);
}


};

export const forgotPassword = async () => {};
export const resetPassword = async () => {};

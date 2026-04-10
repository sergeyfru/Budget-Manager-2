import { z } from "zod";
import { createApiResponseSchema} from "../api_utils";

//
// ======================================================
// 🔹 COMMON
// ======================================================
//

const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/[0-9]/, "Password must contain a number");


//
// ======================================================
// 🔹 USER
// ======================================================
//

// DB
export const userDBSchema = z.object({
  user_id: z.number(),
  email: z.email().transform((val) => val.toLowerCase()),
  first_name: z.string(),
  last_name: z.string(),
  phone_number: z.string().min(10).max(15).nullable(),

  email_verified: z.boolean(),
  phone_verified: z.boolean(),
  is_active: z.boolean(),

  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});
export type UserDB = z.infer<typeof userDBSchema>;

// VIEW
export const userViewSchema = userDBSchema;
export type UserView = z.infer<typeof userViewSchema>;

// RESPONSE
export const resUserSchema = createApiResponseSchema(userViewSchema);
export type ResUser = z.infer<typeof resUserSchema>;


//
// ======================================================
// 🔹 REGISTER
// ======================================================
//

// FORM
export const registerFormSchema = z
  .object({
    email: z.email("Invalid email address").transform((val) => val.toLowerCase()),
    first_name: z.string().min(2),
    last_name: z.string().min(2),
    phone_number: z.string().min(10).max(15).optional(),
    password: passwordSchema,
    confirm_password: z.string(),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

export type RegisterFormValue = z.infer<typeof registerFormSchema>;

// REQUEST
export const reqRegisterSchema = registerFormSchema;
export type ReqRegister = z.infer<typeof reqRegisterSchema>;

// RESPONSE
export const resRegisterSchema = createApiResponseSchema(userViewSchema);
export type ResRegister = z.infer<typeof resRegisterSchema>;


//
// ======================================================
// 🔹 LOGIN
// ======================================================
//

// FORM
export const loginFormSchema = z.object({
  email: z.email("Invalid email address").transform((val) => val.toLowerCase()),
  password: passwordSchema,
});
export type LoginFormValue = z.infer<typeof loginFormSchema>;

// REQUEST
export const reqLoginSchema = loginFormSchema;
export type ReqLogin = z.infer<typeof reqLoginSchema>;

// SERVICE (🔥 полный payload)
export const loginServiceSchema = z.object({
  user: userViewSchema,
  access_token: z.jwt(),
  refresh_token: z.string(),
});
export type LoginService = z.infer<typeof loginServiceSchema>;

// RESPONSE (🔥 без refresh_token)
export const resLoginSchema = createApiResponseSchema(
  loginServiceSchema.omit({ refresh_token: true })
);
export type ResLogin = z.infer<typeof resLoginSchema>;


//
// ======================================================
// 🔹 REFRESH TOKEN
// ======================================================
//

// DB
export const refreshTokenDBSchema = z.object({
  token_id: z.number(),
  user_id: z.number(),
  session_id: z.number().nullable(),

  hashed_refresh_token: z.string(),
  expires_at: z.coerce.date(),

  revoked: z.boolean(),
  created_at: z.coerce.date(),
});

export type RefreshTokenDB = z.infer<typeof refreshTokenDBSchema>;

// SERVICE
export const refreshTokenServiceSchema = z.object({
  access_token: z.jwt(),
  refresh_token: z.string(),
});
export type RefreshTokenService = z.infer<typeof refreshTokenServiceSchema>;

// RESPONSE
export const resRefreshSchema = createApiResponseSchema(
  z.object({
    access_token: z.jwt(),
  })
);
export type ResRefresh = z.infer<typeof resRefreshSchema>;


//
// ======================================================
// 🔹 PASSWORD
// ======================================================
//

// CHANGE PASSWORD
export const reqChangePasswordSchema = z
  .object({
    old_password: z.string(),
    new_password: passwordSchema,
    confirm_new_password: z.string().min(6,"Password must be at least 6 characters"),
  })
  .refine((d) => d.new_password === d.confirm_new_password, {
    message: "New passwords don't match",
    path: ["confirm_new_password"],
  });

export type ReqChangePassword = z.infer<typeof reqChangePasswordSchema>;

// FORGOT PASSWORD 
export const reqForgotPasswordSchema = z.object({
  email: z.email("Invalid email address").transform((val) => val.toLowerCase()),
});
export type ReqForgotPassword = z.infer<typeof reqForgotPasswordSchema>;

// RESET PASSWORD
export const reqResetPasswordSchema = z
  .object({
    token: z.string(),
    new_password: passwordSchema,
    confirm_new_password: z.string().min(6, "Password must be at least 6 characters"),
  })
  .refine((d) => d.new_password === d.confirm_new_password, {
    message: "Passwords don't match",
    path: ["confirm_new_password"],
  });

export type ReqResetPassword = z.infer<typeof reqResetPasswordSchema>;



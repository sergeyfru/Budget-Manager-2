import e from "express";
import { z } from "zod";

// User Info Schema

export const user_info_schema = z.object({
  user_id:  z.number(),
  email: z.email().toLowerCase(),
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  phone_number: z.string().min(10).max(15).optional(),
  email_verified: z.boolean().default(false),
  phone_verified: z.boolean().default(false),
  is_active: z.boolean().default(true),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type UserInfoSchema = z.infer<typeof user_info_schema>;


// Auth Schemas

export const req_login_schema = z.object({
  email: z.email().toLowerCase(),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export type ReqLoginSchema = z.infer<typeof req_login_schema>;


export const req_register_schema = user_info_schema
  .extend({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[a-z]/, "Password must contain a lowercase letter")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[0-9]/, "Password must contain a number"),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

export type ReqRegisterSchema = z.infer<typeof req_register_schema>;

export const req_change_password_schema = z
  .object({
    
    old_password: z.string().min(6, "Password must be at least 6 characters"),
    new_password  : z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[a-z]/, "Password must contain a lowercase letter")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[0-9]/, "Password must contain a number"),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "New passwords don't match",
  });

export type ReqChangePasswordSchema = z.infer<typeof req_change_password_schema>;

export const req_forgot_password_schema = z.object({
  email: z.email().toLowerCase(),
});

export type ReqForgotPasswordSchema = z.infer<typeof req_forgot_password_schema>;

export const req_reset_password_schema = z
  .object({
    token: z.string(),
    new_password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[a-z]/, "Password must contain a lowercase letter")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[0-9]/, "Password must contain a number"),
    confirm_password: z.string().min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "New passwords don't match",
  });

export type ReqResetPasswordSchema = z.infer<typeof req_reset_password_schema>;


export const refreshTokenDBSchema = z.object({
  token_id: z.number().int().positive(),

  user_id: z.number().int().positive(),

  session_id: z.number().int().positive().nullable(),

  hashed_refresh_token: z.string().min(1),

  expires_at: z.coerce.date(), 

  revoked: z.boolean().default(false),

  created_at: z.coerce.date(),
});

export type RefreshTokenDBSchema = z.infer< typeof refreshTokenDBSchema>
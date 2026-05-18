import z from "zod";
import { createApiResponseSchema } from "../api_utils.js";

export const reqVerificationEmailSchema = z.object({
  email: z.email("Invalid email address").transform((val) => val.toLowerCase()),
});

export type ReqVerificationEmail = z.infer<typeof reqVerificationEmailSchema>;

export const verificationStatusSchema = z.object({
  email_verified: z.boolean(),
});

export const resVerificationStatusSchema = createApiResponseSchema(verificationStatusSchema);

export type ResVerificationStatus = z.infer<typeof resVerificationStatusSchema>;

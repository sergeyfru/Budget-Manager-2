import { z } from "zod";
import { createApiResponseSchema } from "../api_utils";


//
// ======================================================
// 🔹 DEFAULT PAYMENT METHOD TYPES
// ======================================================
//

// DB
export const defaultPaymentMethodTypeDBSchema = z.object({
  payment_method_type_id: z.number(),
  payment_method_type_name: z.string(),
  payment_method_type_icon: z.string().nullable(),
  payment_method_type_color: z.string(),
});

export type DefaultPaymentMethodTypeDB = z.infer<
  typeof defaultPaymentMethodTypeDBSchema
>;

// DB ARRAY
export const defaultPaymentMethodTypesArrDBSchema = z.array(
  defaultPaymentMethodTypeDBSchema
);

export type DefaultPaymentMethodTypesArrDB = z.infer<
  typeof defaultPaymentMethodTypesArrDBSchema
>;

// RESPONSE
export const resDefaultPaymentMethodTypesArrSchema = createApiResponseSchema(
  defaultPaymentMethodTypesArrDBSchema
);

export type ResDefaultPaymentMethodTypesArr = z.infer<
  typeof resDefaultPaymentMethodTypesArrSchema
>;


//
// ======================================================
// 🔹 USER PAYMENT METHOD (BASE)
// ======================================================
//

// DB
export const userPaymentMethodDBSchema = z.object({
  user_payment_method_id: z.number(),
  user_id: z.number(),
  payment_method_type_id: z.number(),

  user_payment_method_name: z.string(),
  user_payment_method_icon: z.string().nullable(),
  user_payment_method_color: z.string(),
  user_payment_method_details: z.string(),

  created_at: z.coerce.date(),
});

export type UserPaymentMethodDB = z.infer<typeof userPaymentMethodDBSchema>;

// DB ARRAY
export const userPaymentMethodsArrDBSchema = z.array(
  userPaymentMethodDBSchema
);

export type UserPaymentMethodsArrDB = z.infer<
  typeof userPaymentMethodsArrDBSchema
>;


//
// ======================================================
// 🔹 USER PAYMENT METHOD (VIEW)
// ======================================================
//

export const userPaymentMethodSchema = z.object({
  id: z.number(),
  type_id: z.number(),
  name: z.string(),
  icon: z.string().nullable(),
  color: z.string(),
  details: z.string().nullable(),
});

export type UserPaymentMethod = z.infer<typeof userPaymentMethodSchema>;


//
// ======================================================
// 🔹 CREATE PAYMENT METHOD
// ======================================================
//

// FORM
export const createUserPaymentMethodFormSchema = z.object({
  payment_method_type_id: z.number(),
  user_payment_method_name: z.string().min(1),
  user_payment_method_icon: z.string().nullable().optional(),
  user_payment_method_color: z.string(),
  user_payment_method_details: z.string(),
});

export type CreateUserPaymentMethodForm = z.infer<
  typeof createUserPaymentMethodFormSchema
>;

// REQUEST
export const reqCreateUserPaymentMethodSchema =
  createUserPaymentMethodFormSchema.extend({
    user_id: z.number(),
  });

export type ReqCreateUserPaymentMethod = z.infer<
  typeof reqCreateUserPaymentMethodSchema
>;


//
// ======================================================
// 🔹 UPDATE PAYMENT METHOD
// ======================================================
//

// FORM
export const updateUserPaymentMethodFormSchema =
  createUserPaymentMethodFormSchema.partial();

export type UpdateUserPaymentMethodForm = z.infer<
  typeof updateUserPaymentMethodFormSchema
>;

// REQUEST
export const reqUpdateUserPaymentMethodSchema =
  updateUserPaymentMethodFormSchema.extend({
    user_payment_method_id: z.number(),
  });

export type ReqUpdateUserPaymentMethod = z.infer<
  typeof reqUpdateUserPaymentMethodSchema
>;


//
// ======================================================
// 🔹 DELETE PAYMENT METHOD
// ======================================================
//

export const reqDeleteUserPaymentMethodSchema = z.object({
  user_payment_method_id: z.number(),
});

export type ReqDeleteUserPaymentMethod = z.infer<
  typeof reqDeleteUserPaymentMethodSchema
>;


//
// ======================================================
// 🔹 RESPONSE USER PAYMENT METHODS
// ======================================================
//
// SINGLE
export const resUserPaymentMethodSchema = createApiResponseSchema(
  userPaymentMethodDBSchema
);

export type ResUserPaymentMethod = z.infer<
  typeof resUserPaymentMethodSchema
>;

//ARRAY
export const resUserPaymentMethodsArrSchema = createApiResponseSchema(
  userPaymentMethodsArrDBSchema
);

export type ResUserPaymentMethodsArr = z.infer<
  typeof resUserPaymentMethodsArrSchema
>;
import { z } from "zod";
import { createApiResponseSchema } from "../api_utils";

//
// ======================================================
// 🔹 DEFAULT CATEGORY
// ======================================================
//

// DB
export const defaultCategoryDBSchema = z.object({
  category_type_id: z.number(),
  category_type_name: z.string(),
  category_type_direction: z.enum(["in", "out"]),
  category_type_icon: z.string().nullable(),
  category_type_color: z.string(),
});

export type DefaultCategoryDB = z.infer<typeof defaultCategoryDBSchema>;

// DB ARRAY
export const defaultCategoriesArrDBSchema = z.array(defaultCategoryDBSchema);
export type DefaultCategoriesArrDB = z.infer<typeof defaultCategoriesArrDBSchema>;

// RESPONSE
export const resDefaultCategoriesArrSchema = createApiResponseSchema(
  defaultCategoriesArrDBSchema
);

export type ResDefaultCategoriesArr = z.infer<
  typeof resDefaultCategoriesArrSchema
>;


//
// ======================================================
// 🔹 USER CATEGORY (BASE)
// ======================================================
//

// DB
export const userCategoryDBSchema = z.object({
  user_category_id: z.number(),
  user_id: z.number(),
  user_category_name: z.string(),
  user_category_direction: z.enum(["in", "out"]),
  user_category_icon: z.string().nullable(),
  user_category_color: z.string(),
  created_at: z.date(),
});

export type UserCategoryDB = z.infer<typeof userCategoryDBSchema>;

// ARRAY DB
export const userCategoriesArrDBSchema = z.array(userCategoryDBSchema);
export type UserCategoriesArrDB = z.infer<typeof userCategoriesArrDBSchema>;


//
// ======================================================
// 🔹 USER CATEGORY (VIEW / UI)
// ======================================================
//

export const userCategorySchema = z.object({
  id: z.number(),
  direction: z.enum(["in", "out"]),
  name: z.string(),
  icon: z.string().nullable(),
  color: z.string(),
});

export type UserCategory = z.infer<typeof userCategorySchema>;


//
// ======================================================
// 🔹 CREATE USER CATEGORY
// ======================================================
//

// FORM
export const createUserCategoryFormSchema = z.object({
  user_category_name: z.string().min(1),
  user_category_direction: z.enum(["in", "out"]),
  user_category_icon: z.string().nullable().optional(),
  user_category_color: z.string(),
});

export type CreateUserCategoryForm = z.infer<
  typeof createUserCategoryFormSchema
>;

// REQUEST
export const reqCreateUserCategorySchema = createUserCategoryFormSchema.extend({
  user_id: z.number().optional(),
});

export type ReqCreateUserCategory = z.infer<
  typeof reqCreateUserCategorySchema
>;


//
// ======================================================
// 🔹 UPDATE USER CATEGORY
// ======================================================
//

export const updateUserCategoryFormSchema = createUserCategoryFormSchema.partial();

export type UpdateUserCategoryForm = z.infer<
  typeof updateUserCategoryFormSchema
>;

// REQUEST
export const reqUpdateUserCategorySchema = updateUserCategoryFormSchema

export type ReqUpdateUserCategory = z.infer<
  typeof reqUpdateUserCategorySchema
>;


//
// ======================================================
// 🔹 DELETE USER CATEGORY
// ======================================================
//

//    REQUEST : user_category_id comes in the URL as a params

//    RESPONSE : response as a ResSimple 


//
// ======================================================
// 🔹 RESPONSE USER CATEGORIES
// ======================================================
//

// SINGLE
export const resUserCategorySchema = createApiResponseSchema(
  userCategoryDBSchema
);

export type ResUserCategory = z.infer<typeof resUserCategorySchema>;

// ARRAY
export const resUserCategoriesArrSchema = createApiResponseSchema(
  userCategoriesArrDBSchema
);

export type ResUserCategoriesArr = z.infer<
  typeof resUserCategoriesArrSchema
>;
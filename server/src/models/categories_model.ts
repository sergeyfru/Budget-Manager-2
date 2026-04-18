import { db } from "../config/db";
import { ApiError } from "../errors/ApiErrors";
import { dbErrorHandler } from "../errors/db_errors";
import { validateDB, validateRequest } from "../utils/validation";

import {
  DefaultCategoriesArrDB, defaultCategoriesArrDBSchema,
  ReqCreateUserCategory, UserCategoriesArrDB, UserCategoryDB,
  reqUpdateUserCategorySchema, ReqUpdateUserCategory,
  userCategoriesArrDBSchema, userCategoryDBSchema
} from "@shared/core";

export const getDefaultCategories =
  async (): Promise<DefaultCategoriesArrDB> => {
    try {
      const responseFromDB = await db("category_types").select(
        "category_id",
        "category_name",
        "category_allowed_direction",
        "category_icon",
        "category_color",
        "created_at",
      );
      const defaultCategoryTypes = validateDB(
        defaultCategoriesArrDBSchema,
        responseFromDB,
      );
      return defaultCategoryTypes;
    } catch (error) {
      console.error(error);
      throw dbErrorHandler(error);
    }
  };

export const getUserCategories = async (
  user_id: number,
): Promise<UserCategoriesArrDB> => {
  try {
    const responseFromDB = await db("user_categories")
      .where({ user_id })
      .select(
        "user_category_id",
        "user_id",
        "user_category_allowed_direction",
        "user_category_name",
        "user_category_icon",
        "user_category_color",
        "created_at",
      );

    const userCategories = validateDB(
      userCategoriesArrDBSchema,
      responseFromDB,
    );
    return userCategories;
  } catch (error) {
    console.error(error);
    throw dbErrorHandler(error);
  }
};

export const createUserCategory = async (
    user_id: number,
  newUserCategory: ReqCreateUserCategory,
): Promise<UserCategoryDB> => {
  try {
    const [responseFromDB] = await db("user_categories")
      .insert({ ...newUserCategory, user_id })
      .returning([
        "user_category_id",
        "user_id",
        "user_category_allowed_direction",
        "user_category_name",
        "user_category_icon",
        "user_category_color",
        "created_at",
      ]);
    const newUserCategoryParsed = validateDB(
      userCategoryDBSchema,
      responseFromDB,
    );

    return newUserCategoryParsed;
  } catch (error) {
    console.error(error);
    throw dbErrorHandler(error);
  }
};

export const updateUserCategory = async (
  user_category_id: number,
  updatedUserCategory: ReqUpdateUserCategory,
): Promise<UserCategoryDB> => {
  const validatedData = validateRequest(
    reqUpdateUserCategorySchema,
    updatedUserCategory,
  );

  try {
    const fieldsToUpdate = Object.fromEntries(
      Object.entries(validatedData).filter(([_, v]) => v !== undefined),
    );

    if (Object.keys(fieldsToUpdate).length === 0) {
      throw new ApiError(400, "No fields to update");
    }

    const [responseFromDB] = await db("user_categories")
      .where({ user_category_id })
      .update(fieldsToUpdate)
      .returning([
        "user_category_id",
        "user_id",
        "user_category_allowed_direction",
        "user_category_name",
        "user_category_icon",
        "user_category_color",
        "created_at",
      ]);
    const updatedUserCategoryParsed = validateDB(
      userCategoryDBSchema,
      responseFromDB,
    );

    return updatedUserCategoryParsed;
  } catch (error) {
    console.error(error);
    throw dbErrorHandler(error);
  }
};

export const deleteUserCategory = async (
  user_category_id: number,
): Promise<void> => {
  try {
    await db("user_categories").where({ user_category_id }).del();
    console.log("In Model: Category deleted successfully with ID:", user_category_id);
  } catch (error) {
    console.error(error);
    throw dbErrorHandler(error);
  }
};

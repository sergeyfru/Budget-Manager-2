import { db } from "../config/db";
import { ApiError } from "../errors/ApiErrors";
import { dbErrorHandler } from "../errors/db_errors";

import {
  DefaultPaymentMethodTypesArrDB, defaultPaymentMethodTypesArrDBSchema,
  ReqCreateUserPaymentMethod, ReqUpdateUserPaymentMethod,
  reqUpdateUserPaymentMethodSchema, UserPaymentMethodDB,
  userPaymentMethodDBSchema, UserPaymentMethodsArrDB,
  userPaymentMethodsArrDBSchema
} from "@shared/core";

import { validateDB, validateRequest } from "../utils/validation";

export const getDefaultPaymentMethods =
  async (): Promise<DefaultPaymentMethodTypesArrDB> => {
    try {
      const responseFromDB = await db("payment_method_types").select(
        "payment_method_type_id",
        "payment_method_type_name",
        "payment_method_type_icon",
        "payment_method_type_color",
      );

      const defaultPaymentMethods = validateDB(
        defaultPaymentMethodTypesArrDBSchema,
        responseFromDB,
      );

      return defaultPaymentMethods;
    } catch (error) {
      console.error(error);
      throw dbErrorHandler(error);
    }
  };

export const getUserPaymentMethods = async (
  user_id: number,
): Promise<UserPaymentMethodsArrDB> => {
  try {
    const responseFromDB = await db("user_payment_methods")
      .where({ user_id })
      .select(
        "user_payment_method_id",
        "user_id",
        "payment_method_type_id",
        "user_payment_method_name",
        "user_payment_method_icon",
        "user_payment_method_color",
        "user_payment_method_details",
        "created_at",
      );
    const userPaymentMethods = validateDB(
      userPaymentMethodsArrDBSchema,
      responseFromDB,
    );
    return userPaymentMethods;
  } catch (error) {
    console.error(error);
    throw dbErrorHandler(error);
  }
};

export const createUserPaymentMethod = async (
  newUserPaymentMethod: ReqCreateUserPaymentMethod,
): Promise<UserPaymentMethodDB> => {
  try {
    const responseFromDB = await db("user_payment_methods")
      .insert(newUserPaymentMethod)
      .returning([
        "user_payment_method_id",
        "user_id",
        "payment_method_type_id",
        "user_payment_method_name",
        "user_payment_method_icon",
        "user_payment_method_color",
        "user_payment_method_details",
        "created_at",
      ])
      .first();

    const newUserPaymentMethodParsed = validateDB(
      userPaymentMethodDBSchema,
      responseFromDB,
    );
    return newUserPaymentMethodParsed;
  } catch (error) {
    console.error(error);
    throw dbErrorHandler(error);
  }
};

export const updateUserPaymentMethod = async (
  user_payment_method_id: number,
  updatedUserPaymentMethod: ReqUpdateUserPaymentMethod,
): Promise<UserPaymentMethodDB> => {
  const validatedData = validateRequest(
    reqUpdateUserPaymentMethodSchema,
    updatedUserPaymentMethod,
  );
  try {
    const fieldsToUpdate = Object.fromEntries(
      Object.entries(validatedData).filter(([_, v]) => v !== undefined),
    );

    if (Object.keys(fieldsToUpdate).length === 0) {
      throw new ApiError(400, "No fields to update");
    }

    const responseFromDB = await db("user_payment_methods")
      .where({ user_payment_method_id })
      .update(fieldsToUpdate)
      .returning([
        "user_payment_method_id",
        "user_id",
        "payment_method_type_id",
        "user_payment_method_name",
        "user_payment_method_icon",
        "user_payment_method_color",
        "user_payment_method_details",
        "created_at",
      ])
      .first();
    const newUserPaymentMethodParsed = validateDB(
      userPaymentMethodDBSchema,
      responseFromDB,
    );
    return newUserPaymentMethodParsed;
  } catch (error) {
    console.error(error);
    throw dbErrorHandler(error);
  }
};

export const deleteUserPaymentMethod = async (
  user_payment_method_id: number,
): Promise<void> => {
  try {
    await db("user_payment_methods").where({ user_payment_method_id }).del();
  } catch (error) {
    console.error(error);
    throw dbErrorHandler(error);
  }
};

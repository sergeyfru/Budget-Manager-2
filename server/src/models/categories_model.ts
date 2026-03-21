import { db } from "../config/db";
import { ApiError } from "../errors/ApiErrors";
import { dbErrorHandler } from "../errors/db_errors";
import { defaultCategoryTypesArrDBSchema, DefaultCategoryTypesArrDBSchema, ReqCreateUserCategorySchema, reqUpdateUserCategorySchema, ReqUpdateUserCategorySchema, userCategoriesArrDBSchema, UserCategoriesArrDBSchema, userCategoryDBSchema, UserCategoryDBSchema } from "../schemas/transaction_schema";
import { validateDB, validateRequest } from "../utils/validation";

export const getDefaultCategories = async (): Promise<DefaultCategoryTypesArrDBSchema> =>{
    try {
        const responseFromDB = await db("category_types").select("category_type_id", "category_type_name","category_type_icon","category_type_color")
       const defaultCategoryTypes = validateDB(defaultCategoryTypesArrDBSchema, responseFromDB)
        return defaultCategoryTypes
    } catch (error) {
        console.error(error);
        throw dbErrorHandler(error)
    }
}

export const getUserCategories = async (user_id:number): Promise<UserCategoriesArrDBSchema> =>{
    try {
        const responseFromDB = await db("user_categories").where({user_id}).select("user_category_id", "user_id","category_type_id","user_category_name","user_category_icon","user_category_color")

        const userCategories = validateDB(userCategoriesArrDBSchema, responseFromDB)
        return userCategories
    } catch (error) {
        console.error(error);
        throw dbErrorHandler(error)
    }
}

export const createUserCategory = async (newUserCategory:ReqCreateUserCategorySchema): Promise<UserCategoryDBSchema> =>{
    try {
        const responseFromDB = await db("user_categories")
        .insert(newUserCategory)
        .returning(["user_category_id", "user_id","category_type_id","user_category_name","user_category_icon","user_category_color", "created_at"]).first()
        const newUserCategoryParsed = validateDB(userCategoryDBSchema, responseFromDB);

        return newUserCategoryParsed;
    } catch (error) {
        console.error(error);
        throw dbErrorHandler(error);
    }
}

export const updateUserCategory = async (user_category_id:number, updatedUserCategory: ReqUpdateUserCategorySchema ): Promise<UserCategoryDBSchema> =>{
    const validatedData = validateRequest(reqUpdateUserCategorySchema, updatedUserCategory);

    try {

        const fieldsToUpdate = Object.fromEntries(
              Object.entries(validatedData).filter(([_, v]) => v !== undefined),
            );
        
            if (Object.keys(fieldsToUpdate).length === 0) {
              throw new ApiError(400, "No fields to update");
            }

        const responseFromDB = await db("user_categories")
        .where({ user_category_id })
        .update(fieldsToUpdate)
        .returning(["user_category_id", "user_id","category_type_id","user_category_name","user_category_icon","user_category_color", "created_at"]).first()
        const updatedUserCategoryParsed = validateDB(userCategoryDBSchema, responseFromDB);

        return updatedUserCategoryParsed;
    } catch (error) {
        console.error(error);
        throw dbErrorHandler(error);
    }
}

export const deleteUserCategory = async (user_category_id:number): Promise<void> =>{
    try {
        await db("user_categories")
        .where({ user_category_id })
        .del()
    } catch (error) {
        console.error(error);
        throw dbErrorHandler(error);
    }
}
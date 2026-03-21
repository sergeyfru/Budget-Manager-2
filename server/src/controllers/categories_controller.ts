import { Request, Response } from "express";
import {
  createUserCategory,
  deleteUserCategory,
  getDefaultCategories,
  getUserCategories,
  updateUserCategory,
} from "../models/categories_model";
import { ReqCreateUserCategorySchema, ReqUpdateUserCategorySchema } from "../schemas/transaction_schema";

export const _getDefaultCategories = async (req: Request, res: Response) => {
  try {
    const defaultCategories = await getDefaultCategories();

    res
      .status(200)
      .json({
        defaultCategories,
        status: "success",
        message: "Here are all default categories",
      });
  } catch (error: any) {
    res.status(error.status || 500).json({
      error: error.message,
    });
  }
};

export const _getUserCategories = async (req: Request, res: Response) => {
  const user_id = req.user?.user_id as number;
  try {
    const userCategories = await getUserCategories(user_id);

    res
      .status(200)
      .json({
        userCategories,
        status: "success",
        message: "Here are all user categories",
      });
  } catch (error: any) {
    res.status(error.status || 500).json({
      error: error.message,
    });
  }
};

export const _createUserCategory = async (req: Request, res: Response) => {
  const newUserCategory = req.body as ReqCreateUserCategorySchema;
  try {
    const createdUserCategory = await createUserCategory(newUserCategory);

    res
      .status(201)
      .json({
        createdUserCategory,
        status: "success",
        message: "User category created successfully",
      });
  } catch (error: any) {
    res.status(error.status || 500).json({
      error: error.message,
    });
  }
};

export const _updateUserCategory = async (req: Request, res: Response) => {
  const updatedCategory = req.body as ReqUpdateUserCategorySchema;
  const user_category_id = parseInt(req.params.id as string);
    try {  
        const updatedUserCategory = await updateUserCategory(user_category_id, updatedCategory);

       res
      .status(201)
      .json({
        updatedUserCategory,
        status: "success",
        message: "User category updated successfully",
      });
  } catch (error: any) {
    res.status(error.status || 500).json({
      error: error.message,
    });
  }
};

export const _deleteUserCategory = async (req: Request, res: Response) => {
    const  user_category_id  = parseInt(req.params.id as string); ;

    try {
        await deleteUserCategory(user_category_id);
        
res.status(200).json({
    status: "success",
    message: "User category deleted successfully",
  });

    } catch (error: any) {
        res.status(error.status || 500).json({
            error: error.message,
        });
    }
}

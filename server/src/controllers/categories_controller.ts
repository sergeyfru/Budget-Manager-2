import { Request, Response } from "express";
import {
  createUserCategory,
  deleteUserCategory,
  getDefaultCategories,
  getUserCategories,
  updateUserCategory,
} from "../models/categories_model";
import {
  ReqCreateUserCategory, ReqUpdateUserCategory,
  ResDefaultCategoriesArr, ResSimple,
  ResUserCategoriesArr, ResUserCategory
} from "@shared/core";

export const _getDefaultCategories = async (req: Request, res: Response<ResDefaultCategoriesArr>): Promise<void> => {
  try {
    const defaultCategories = await getDefaultCategories();

    res.status(200).json({
      data: defaultCategories,
      status: "success",
      message: "Here are all default categories",
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const _getUserCategories = async (req: Request, res: Response<ResUserCategoriesArr>): Promise<void> => {
  const user_id = req.user?.user_id as number;
  try {
    const userCategories = await getUserCategories(user_id);

    res.status(200).json({
      data: userCategories,
      status: "success",
      message: "Here are all user categories",
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const _createUserCategory = async (req: Request, res: Response<ResUserCategory>): Promise<void> => {
  const user_id = req.user?.user_id as number;
  const newUserCategory = req.body as ReqCreateUserCategory;

  try {
    const createdUserCategory = await createUserCategory(user_id, newUserCategory);

    res.status(201).json({
      data: createdUserCategory,
      status: "success",
      message: "Category created successfully",
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const _updateUserCategory = async (req: Request, res: Response<ResUserCategory>): Promise<void> => {
  const updatedCategory = req.body as ReqUpdateUserCategory;
  const user_category_id = parseInt(req.params.id as string);
  console.log("In Controller: Received request to update category with ID:", user_category_id, "and data:", updatedCategory);
  try {
    const updatedUserCategory = await updateUserCategory(user_category_id, updatedCategory);

    res.status(201).json({
      data: updatedUserCategory,
      status: "success",
      message: "Category updated successfully",
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const _deleteUserCategory = async (req: Request, res: Response<ResSimple>): Promise<void> => {
  const user_category_id = parseInt(req.params.id as string);
  const params = req.params;
  try {
    await deleteUserCategory(user_category_id);
    console.log("In Controller: Category deleted successfully with ID:", user_category_id);
    res.status(200).json({
      status: "success",
      message: "Category deleted successfully",
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      status: "error",
      message: error.message,
    });
  }
};

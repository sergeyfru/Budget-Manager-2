import type { 
  ResDefaultCategoriesArr, ReqUpdateUserCategory,
  ResUserCategoriesArr, ResSimple, ResUserCategory,
  ReqCreateUserCategory
} from "@shared/core";
import { api } from "./axios";

export const categoriesApi = {

  getDefaultCategoryTypes: (): Promise<ResDefaultCategoriesArr> =>
    api.get("/categories/default").then((res) => res.data),

  getUserCategories: () : Promise<ResUserCategoriesArr> =>
    api.get("/categories").then((res) => res.data),

  createUserCategory: (data: ReqCreateUserCategory): Promise<ResUserCategory> =>
    api.post("/categories", data).then((res) => res.data),

  updateUserCategory: (user_category_id: number, data: ReqUpdateUserCategory): Promise<ResUserCategory> =>
    api.patch(`/categories/${user_category_id}`, data).then((res) => res.data),

  deleteUserCategory: (user_category_id: number): Promise<ResSimple> =>
    api.delete(`/categories/${user_category_id}`).then((res) => res.data),
};
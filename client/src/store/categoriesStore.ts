import { create } from "zustand";
import { categoriesApi } from "../api/categoriesApi";
import type {
  DefaultCategoriesArrDB,UserCategoriesArrDB,
  ReqCreateUserCategory, Status,
  ReqUpdateUserCategory, 
} from "@shared/core";
import { toast } from "sonner";
import { persist } from "zustand/middleware";

type CategoriesState = {
  defaultCategories: DefaultCategoriesArrDB;
  defaultCategoriesStatus: Status;
  defaultCategoriesError: string | null;

  categories: UserCategoriesArrDB;
  categoriesStatus: Status;
  categoriesError: string | null;

  getUserCategories: () => void;
  getDefaultCategories: () => void;
  createUserCategory: (data: ReqCreateUserCategory) => void;
  updateUserCategory: (user_category_id: number, data: ReqUpdateUserCategory) => void;
  deleteUserCategory: (user_category_id: number) => void;

  setUserCategories: (data: UserCategoriesArrDB) => void;
  setDefaultCategories: (data: DefaultCategoriesArrDB) => void;

  getCategoriesByDirection: (direction: "in" | "out") => UserCategoriesArrDB;

  clear: () => void;
};

export const useCategoriesStore = create<CategoriesState>()(
  persist(
    (set, get) => ({
      defaultCategories: [] as DefaultCategoriesArrDB,
      categories: [] as UserCategoriesArrDB,

      categoriesStatus: "idle",
      defaultCategoriesStatus: "idle",

      categoriesError: null,
      defaultCategoriesError: null,

      getDefaultCategories: async () => {
        set({ defaultCategoriesStatus: "loading", defaultCategoriesError: null });
        const response = await categoriesApi.getDefaultCategoryTypes();
        if (response.status === "error") {
          console.error("Error fetching default categories:", response.message);
          set({ defaultCategoriesStatus: "error", defaultCategoriesError: response.message });
          return;
        }
        console.log("Default categories:", response.data);

        set({ defaultCategories: response.data.sort((a, b) => a.category_id - b.category_id), defaultCategoriesStatus: "success" });
      },

      getUserCategories: async () => {
        set({ categoriesStatus: "loading", categoriesError: null });
        const response = await categoriesApi.getUserCategories();

        if (response.status === "error") {
          console.error("Error fetching user categories:", response.message);
          set({ categoriesStatus: "error", categoriesError: response.message });
          return;
        }
        console.log("User categories:", response.data);
        set({ categories: response.data.sort((a, b) => a.user_category_id - b.user_category_id), categoriesStatus: "success" });
      },

      createUserCategory: async (data: ReqCreateUserCategory) => {
        set({ categoriesStatus: "loading", categoriesError: null });
        const response = await categoriesApi.createUserCategory(data);
        if (response.status === "error") {
          console.error("Error creating user category:", response.message);
          set({ categoriesStatus: "error", categoriesError: response.message });
          return;
        }

        console.log("createUserCategory response:", response);

        toast.success(response.message);
        set((state) => ({
          categories: [...state.categories, response.data].sort((a, b) => a.user_category_id - b.user_category_id),
          categoriesStatus: "success",
        }));
      },
      updateUserCategory: async (user_category_id: number, data: ReqUpdateUserCategory) => {
        set({ categoriesStatus: "loading", categoriesError: null });
        const response = await categoriesApi.updateUserCategory(user_category_id,data);

        if (response.status === "error") {
          console.error("Error updating user category:", response.message);
          set({ categoriesStatus: "error", categoriesError: response.message });
          return;
        }
        console.log("updateUserCategory response:", response);
        toast.success(response.message);
        set((state) => ({
          categories: state.categories.map((category) =>
            category.user_category_id === response.data.user_category_id ? response.data : category,
          ),
          categoriesStatus: "success",
        }));
      },
      deleteUserCategory: async (user_category_id: number) => {
        set({ categoriesStatus: "loading", categoriesError: null });
        const response = await categoriesApi.deleteUserCategory(user_category_id);

        console.log("deleteUserCategory response:", response);

        if (response.status === "error") {
          console.error("Error deleting user category:", response.message);
          set({ categoriesStatus: "error", categoriesError: response.message });
          return;
        }
        toast.success(response.message);
        set((state) => ({
          categories: state.categories.filter((category) => category.user_category_id !== user_category_id),
          categoriesStatus: "success",
        }));
      },
      setUserCategories: (data: UserCategoriesArrDB) => set({ categories: data }),
      setDefaultCategories: (data: DefaultCategoriesArrDB) => set({ defaultCategories: data }),

      getCategoriesByDirection: (direction: "in" | "out") =>
        get().categories.filter((c) => c.user_category_allowed_direction === direction || c.user_category_allowed_direction === "both"),

      clear: () => set({ categories: [] as UserCategoriesArrDB, defaultCategories: [] as DefaultCategoriesArrDB }),
    }),
    {
      name: "categories-storage", // name of the item in storage
      partialize: (state) => ({
        categories: state.categories,
        defaultCategories: state.defaultCategories,
      }),
    },
  ),
);

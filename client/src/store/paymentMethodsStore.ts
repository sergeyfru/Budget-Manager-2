import type {
  ReqCreateUserPaymentMethod,
  ReqUpdateUserPaymentMethod,
  Status,
  UserPaymentMethodsArrDB,
} from "@shared/core";
import { create } from "zustand";

import { persist } from "zustand/middleware";
import { paymentMethodsApi } from "../api/paymentMethodsApi";
import { toast } from "sonner";

type PaymentMethodsState = {
  paymentMethods: UserPaymentMethodsArrDB;
  paymentMethodsStatus: Status;
  paymentMethodsError: string | null;
  // actions
  setPaymentMethods: (data: UserPaymentMethodsArrDB) => void;
  getUserPaymentMethods: () => void;
  createUserPaymentMethod: (data: ReqCreateUserPaymentMethod) => void;
  updateUserPaymentMethod: (user_payment_method_id: number, data: ReqUpdateUserPaymentMethod) => void;
  deleteUserPaymentMethod: (user_payment_method_id: number) => void;

  setLoading: (value: boolean) => void;
  setError: (message: string | null) => void;

  clear: () => void;
};

export const usePaymentMethodsStore = create<PaymentMethodsState>()(
  persist(
    (set) => ({
      paymentMethods: [] as UserPaymentMethodsArrDB,
      paymentMethodsStatus: "idle",
      paymentMethodsError: null,

      setPaymentMethods: async (data: UserPaymentMethodsArrDB) => {
        set(() => ({
          paymentMethods: data,
        }));
      },

      getUserPaymentMethods: async () => {
        set({ paymentMethodsStatus: "loading", paymentMethodsError: null });
        const response = await paymentMethodsApi.getUserPaymentMethods();
        if (response.status === "error") {
          set({
            paymentMethodsStatus: "error",
            paymentMethodsError: response.message || "Failed to fetch user payment methods",
          });
          return;
        }
        set({ paymentMethods: response.data.sort((a,b)=>a.user_payment_method_id - b.user_payment_method_id), paymentMethodsStatus: "success" });
      },

      createUserPaymentMethod: async (data: ReqCreateUserPaymentMethod) => {
                set({ paymentMethodsStatus: "loading", paymentMethodsError: null });
                const response = await paymentMethodsApi.createUserPaymentMethod(data);
                if (response.status === "error") {
                  console.error("Error creating user category:", response.message);
                  set({ paymentMethodsStatus: "error", paymentMethodsError: response.message });
                  return;
                }
                toast.success(response.message);
                set((state) => ({
                  paymentMethods: [...state.paymentMethods, response.data],
                  paymentMethodsStatus: "success",
                }));
      },
      updateUserPaymentMethod: async (user_payment_method_id: number, data: ReqUpdateUserPaymentMethod) => {
        set({ paymentMethodsStatus: "loading", paymentMethodsError: null });
        const response = await paymentMethodsApi.updateUserPaymentMethod(user_payment_method_id, data);

        if (response.status === "error") {
          console.error("Error updating user category:", response.message);
          set({ paymentMethodsStatus: "error", paymentMethodsError: response.message });
          return;
        }
        toast.success(response.message);
        set((state) => ({
          paymentMethods: state.paymentMethods.map((paymentMethod) =>
            paymentMethod.user_payment_method_id === response.data.user_payment_method_id
              ? response.data
              : paymentMethod,
          ),
          paymentMethodsStatus: "success",
        }));
      },
      deleteUserPaymentMethod: async (user_payment_method_id: number) => {
        set({ paymentMethodsStatus: "loading", paymentMethodsError: null });
        const response = await paymentMethodsApi.deleteUserPaymentMethod(user_payment_method_id);


        if (response.status === "error") {
          console.error("Error deleting user category:", response.message);
          set({ paymentMethodsStatus: "error", paymentMethodsError: response.message });
          return;
        }
        toast.success(response.message);
        set((state) => ({
          paymentMethods: state.paymentMethods.filter(
            (paymentMethod) => paymentMethod.user_payment_method_id !== user_payment_method_id,
          ),
          paymentMethodsStatus: "success",
        }));
      },

      setLoading: (value) =>
        set(() => ({
          paymentMethodsStatus: value ? "loading" : "idle",
          paymentMethodsError: null,
        })),

      setError: (message) =>
        set(() => ({
          paymentMethodsStatus: "error",
          paymentMethodsError: message,
        })),

      clear: () =>
        set(() => ({
          paymentMethods: [] as UserPaymentMethodsArrDB,
          paymentMethodsStatus: "idle",
          paymentMethodsError: null,
        })),
    }),
    {
      name: "payment-storage",
      partialize: (state) => ({
        paymentMethods: state.paymentMethods,
      }),
    },
  ),
);

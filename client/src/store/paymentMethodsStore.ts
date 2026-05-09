import type {
  ReqCreateUserPaymentMethod,
  ReqUpdateUserPaymentMethod,
  Status,
  UserPaymentMethodsArrDB,
} from "@shared/core";
import { create } from "zustand";

import { persist } from "zustand/middleware";
import { paymentMethodsApi } from "../api/paymentMethodsApi";

type PaymentMethodsState = {
  paymntentMethods: UserPaymentMethodsArrDB;
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

export const usePaymentMethods = create<PaymentMethodsState>()(
  persist(
    (set) => ({
      paymntentMethods: [] as UserPaymentMethodsArrDB,
      paymentMethodsStatus: "idle",
      paymentMethodsError: null,

      setPaymentMethods: async (data: UserPaymentMethodsArrDB) => {
        set(() => ({
          paymntentMethods: data,
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
        set({ paymntentMethods: response.data, paymentMethodsStatus: "success" });
      },

      createUserPaymentMethod: async (data: ReqCreateUserPaymentMethod) => {
        console.log("Will create User's Payment Method with data:", data);
      },
      updateUserPaymentMethod: async (user_payment_method_id: number, data: ReqUpdateUserPaymentMethod) => {
        console.log("Will update Payment Method with ID:", user_payment_method_id, ", and data:", data);
      },
      deleteUserPaymentMethod: async (user_payment_method_id: number) => {
        console.log("Will delete Payment Method with ID:", user_payment_method_id);
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
          paymntentMethods: [] as UserPaymentMethodsArrDB,
          paymentMethodsStatus: "idle",
          paymentMethodsError: null,
        })),
    }),
    {
      name: "payment-storage",
      partialize: (state) => ({
        paymntentMethods: state.paymntentMethods,
      }),
    },
  ),
);

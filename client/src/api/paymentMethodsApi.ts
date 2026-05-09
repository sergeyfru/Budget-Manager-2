
import type { ReqCreateUserPaymentMethod, ReqUpdateUserPaymentMethod, ResSimple, ResUserPaymentMethod, ResUserPaymentMethodsArr } from "@shared/core";
import { api } from "./axios";

export const paymentMethodsApi = {

  
  getUserPaymentMethods: () : Promise<ResUserPaymentMethodsArr> =>
    api.get("/paymentmethods").then((res) => res.data),

  createUserPaymentMethod: (data: ReqCreateUserPaymentMethod): Promise<ResUserPaymentMethod> =>
    api.post("/paymentmethods", data).then((res) => res.data),

  updateUserPaymentMethod: (user_payment_method_id: number, data: ReqUpdateUserPaymentMethod): Promise<ResUserPaymentMethod> =>
    api.patch(`/paymentmethods/${user_payment_method_id}`, data).then((res) => res.data),

  deleteUserPaymentMethod: (user_payment_method_id: number): Promise<ResSimple> =>
    api.delete(`/paymentmethods/${user_payment_method_id}`).then((res) => res.data),
};
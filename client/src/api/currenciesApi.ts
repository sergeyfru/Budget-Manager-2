
import type {  ResCurrenciesArr } from "@shared/core";
import { api } from "./axios";

export const currenciesApi = {
  
  getCurrensies: () : Promise<ResCurrenciesArr> =>
    api.get("/currencies").then((res) => res.data),

};
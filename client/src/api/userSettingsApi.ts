import type { ResCurrency, ResSimple } from "@shared/core";
import { api } from "./axios";

export const userSettingsApi = {
  changeBaseCurrency: (base_currency_id: number): Promise<ResSimple> =>
    api.patch("/user-preferences/base-currency", { base_currency_id }).then((res) => res.data),

  getBaseCurrency: ():Promise<ResCurrency> =>
    api.get("/user-preferences/base-currency" ).then((res) => res.data),
};

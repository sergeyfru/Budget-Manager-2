import { z } from "zod";
import { createApiResponseSchema } from "../api_utils.js";

//
// ======================================================
// 🔹 CURRENCY
// ======================================================
//

// DB

export const currencyDBSchema = z.object({
  currency_id: z.number(),
  currency_code: z.string(),
  currency_symbol: z.string().nullable(),
  currency_name: z.string(),
  created_at: z.coerce.date(),
});

export type CurrencyDB = z.infer<typeof currencyDBSchema>;

export const currenciesArrDBSchema = z.array(currencyDBSchema);
export type CurrenciesArrDB = z.infer<typeof currenciesArrDBSchema>;

// RESPONSE 

export const resCurrenciesArrSchema = createApiResponseSchema(
  currenciesArrDBSchema
);

export type ResCurrenciesArr = z.infer<typeof resCurrenciesArrSchema>;
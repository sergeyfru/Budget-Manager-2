import { z } from "zod";
import { createApiResponseSchema } from "../api_utils.js";

//
// ======================================================
// 🔹 RATE EXCHANGE API
// ======================================================
//

const exchangeRateApiErrorSchema = z.object({
  result: z.literal("error"),
  documentation: z.url(),
  "terms-of-use": z.url(),
  "error-type": z.string(),
});

const exchangeRateApiSuccessSchema = z.object({
  result: z.literal("success"),
  documentation: z.url(),
  terms_of_use: z.url(),
  time_last_update_unix: z.number(),
  time_last_update_utc: z.string(),
  time_next_update_unix: z.number(),
  time_next_update_utc: z.string(),
  base_code: z.string(),
  conversion_rates: z.record(z.string(), z.number()),
});

export const exchangeRateApiResponseSchema = z.discriminatedUnion("result", [
  exchangeRateApiErrorSchema,
  exchangeRateApiSuccessSchema,
]);

export type ExchangeRateApiResponse = z.infer<typeof exchangeRateApiResponseSchema>;

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
  currency_country: z.string().nullable(),
  currency_flag: z.string().nullable(),
  currency_time_last_update_unix: z.number().int().nonnegative(),
  currency_time_next_update_unix: z.number().int().nonnegative(),
  currency_exchange_rate_usd: z.coerce.number(),
  currency_rate_updated_at: z.coerce.date(),
  created_at: z.coerce.date(),
});

export type CurrencyDB = z.infer<typeof currencyDBSchema>;

export const currencyForUpdateSchema = z.object({
  currency_exchange_rate_usd: z.number(),
  currency_rate_updated_at: z.string(),
  currency_time_last_update_unix: z.number(),
  currency_time_next_update_unix: z.number(),
});
export type CurrencyForUpdate = z.infer<typeof currencyForUpdateSchema>;

export const currenciesArrDBSchema = z.array(currencyDBSchema);
export type CurrenciesArrDB = z.infer<typeof currenciesArrDBSchema>;

// RESPONSE

export const resCurrencySchema = createApiResponseSchema(currencyDBSchema);
export type ResCurrency = z.infer<typeof resCurrencySchema>;

export const resCurrenciesArrSchema = createApiResponseSchema(currenciesArrDBSchema);
export type ResCurrenciesArr = z.infer<typeof resCurrenciesArrSchema>;

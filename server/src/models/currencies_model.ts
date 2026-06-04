import { db } from "../config/db";
import { dbErrorHandler } from "../errors/db_errors";
import { currenciesArrDBSchema, CurrencyForUpdate } from "@shared/core";
import { validateDB } from "../utils/validation";

export const getAllCurrencies = async () => {
  try {
    const responseFromDB = await db("currencies")
      .select(
        "currency_id",
        "currency_code",
        "currency_name",
        "currency_symbol",
        "currency_country",
        "currency_flag",
        "currency_exchange_rate_usd",
        "currency_time_last_update_unix",
        "currency_time_next_update_unix",
        "currency_rate_updated_at",
        "created_at",
      )
      .orderBy("currency_id");
    const validCurrencies = validateDB(currenciesArrDBSchema, responseFromDB);

    return validCurrencies;
  } catch (error) {
    console.error("Error fetching currencies:", error);
    throw dbErrorHandler(error);
  }
};

export const getNotExpiredCurrencies = (now: number) => {
  return db("currencies").where("currency_time_next_update_unix", ">=", now);
};

export const updateCurrencyRateExchange = (currency_code: string, data: CurrencyForUpdate) => {
  return db("currencies").update(data).where({ currency_code });
};

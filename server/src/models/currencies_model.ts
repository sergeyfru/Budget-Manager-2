import {db } from "../config/db";
import { dbErrorHandler } from "../errors/db_errors";
import { currenciesArrDBSchema } from "../schemas/transaction_schema";
import { validateDB } from "../utils/validation";

export const getAllCurrencies = async () => {
    try {
      const responseFromDB = await db("currencies").select(
        "currency_id",
        "currency_code",
        "currency_name",
        "currency_symbol",
        "created_at",
      );
      const validCurrencies = validateDB(currenciesArrDBSchema, responseFromDB);

      return validCurrencies;
    } catch (error) {
      console.error("Error fetching currencies:", error);
      throw dbErrorHandler(error);
    }
  };
import { Request, Response } from "express";
import { change_base_currency, get_base_currency_full, get_base_currency_id } from "../models/user_preferences_model";
import { currencyDBSchema, ResCurrency, ResSimple } from "@shared/core";
import { validateDB } from "../utils/validation";

export const _change_base_currency = async (req: Request, res: Response<ResSimple>) => {
  const user_id = req.user?.user_id as number;
  const { base_currency_id } = req.body;
  console.log("base_currency_id:", base_currency_id, "and user_id:", user_id);

  try {
    await change_base_currency({ user_id, base_currency_id });
    res.status(201).json({ status: "success", message: "Base currency updated succesfully" });
  } catch (error: any) {
    console.error(error);

    res.status(error.status || 500).json({
      status: "error",
      message: error.message || "An unexpected error occurred during changing base currency.",
    });
  }
};

export const _get_base_currency = async (req: Request, res: Response<ResCurrency>) => {
  const user_id = req.user?.user_id as number;

  try {
    const { base_currency_id } = await get_base_currency_id(user_id);

    const dbResponse = await get_base_currency_full(base_currency_id);

    const defaultCurrency = validateDB(currencyDBSchema, dbResponse);
    res.status(201).json({ status: "success", message: "Base currency fetched succesfully", data: defaultCurrency });
  } catch (error: any) {
    console.error(error);

    res.status(error.status || 500).json({
      status: "error",
      message: error.message || "An unexpected error occurred during changing base currency.",
    });
  }
};

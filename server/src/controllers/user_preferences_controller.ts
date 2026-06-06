import { Request, Response } from "express";
import { change_base_currency } from "../models/user_preferences_model";
import { ResSimple } from "@shared/core";

export const _change_base_currency = async (req: Request, res: Response<ResSimple>) => {
  const user_id = req.user?.user_id as number;
  const { base_currency_id } = req.body;
  console.log("base_currency_id:",base_currency_id,"and user_id:", user_id);
  
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

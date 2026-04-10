import { Request, Response } from "express";
import { getAllCurrencies } from "../models/currencies_model";
import { ResCurrenciesArr } from "@shared/core";

export const _getAllCurrencies = async (req: Request, res: Response<ResCurrenciesArr>) => {
    try {
        const currencies = await getAllCurrencies();
        res.status(200).json({
            data: currencies,
            status: "success",
            message: "Here are all currencies",
        });
    } catch (error: any) {
        console.error("Error fetching currencies:", error);
        res.status(error.status || 500).json({
            status: "error",
            message: error.message,
        });
    }
}
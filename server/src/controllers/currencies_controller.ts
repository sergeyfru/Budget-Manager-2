import { Request, Response } from "express";
import { getAllCurrencies } from "../models/currencies_model";

export const _getAllCurrencies = async (req: Request, res: Response) => {
    try {
        const currencies = await getAllCurrencies();
        res.status(200).json({
            currencies,
            status: "success",
            message: "Here are all currencies",
        });
    } catch (error: any) {
        console.error("Error fetching currencies:", error);
        res.status(error.status || 500).json({
            error: error.message,
        });
    }
}
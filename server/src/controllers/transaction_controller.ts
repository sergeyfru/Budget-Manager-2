import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { addTransaction, getUsersTransactions, getUsersTransactionsByDateRange } from "../models/transaction_models";
import { errorHandler } from "../middlewares/middleware";
import { dbErrorHandler } from "../errors/db_errors";
import { ReqAddTransactionSchema } from "../schemas/transaction_schema";

export const _getUsersTransactions = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  try {
    if (!cookies.access_token) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }
    const access_token = cookies.access_token;
    const decodedAccToken = jwt.decode(access_token);
    if (!decodedAccToken || typeof decodedAccToken === "string") {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }
    console.log("Decoded access token:", decodedAccToken);
    const user_id = decodedAccToken.user_id;

    const transactions = await getUsersTransactions(user_id);
    res.status(200).json(transactions);

  } catch (error: any) {
    res.status(error.status || 500).json({
      error: error.message,
    });
  }
};

export const _getUsersTransactionsByDateRange = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  try {
    if (!cookies.access_token) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }
    const access_token = cookies.access_token;
    const decodedAccToken = jwt.decode(access_token);
    if (!decodedAccToken || typeof decodedAccToken === "string") {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }
    console.log("Decoded access token:", decodedAccToken);
    const user_id = decodedAccToken.user_id;
    const { start_date, end_date } = req.body;
    const transactionsByDateRange = await getUsersTransactionsByDateRange(
      user_id,
      new Date(start_date),
      new Date(end_date),);

    res.status(200).json(transactionsByDateRange);

  } catch (error: any) {
    res.status(error.status || 500).json({
      error: error.message,
    });
  }
};

export const _addTransaction = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  try {
    if (!cookies.access_token) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }
    const access_token = cookies.access_token;
    const decodedAccToken = jwt.decode(access_token);
    if (!decodedAccToken || typeof decodedAccToken === "string") {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }
    console.log("Decoded access token:", decodedAccToken);
    const user_id = decodedAccToken.user_id;

    const transactionData = req.body as ReqAddTransactionSchema;
    
   const transactions = await addTransaction(user_id, transactionData);


    res.status(201).json(transactions);

} catch (error: any) {
    res.status(error.status || 500).json({
      error: error.message,
    });
  }
};
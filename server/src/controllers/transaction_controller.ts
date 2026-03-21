import { Request, Response } from "express";
import {
  addTransaction,
  deleteTransaction,
  getTransactions,
  getTransactionsByDateRange,
  updateTransaction,
} from "../models/transaction_models";
import {
  ReqAddTransactionSchema,
} from "../schemas/transaction_schema";
import { UserInfoSchema } from "../schemas/user_auth_schema";

export const _getTransactions = async (req: Request, res: Response) => {
  const user_id = req.user?.user_id as number;

  try {

    const transactions = await getTransactions(user_id);
    if (transactions.length === 0) {
      return res.send(200).json({
        transactions: [],
        status: "success",
        message: "No transactions found",
      });
    } 

    return res.status(201).json({
      transactions,
      status: "success",
      message: "Here are all transactions",
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      error: error.message,
    });
  }
};

export const _getTransactionsByDateRange = async (
  req: Request,
  res: Response,
) => {
  const user_id = req.user?.user_id as number;
  

  try {
    
    const { start_date, end_date } = req.body;
    const transactionsByDateRange = await getTransactionsByDateRange(
      user_id,
      new Date(start_date),
      new Date(end_date),
    );

    if (transactionsByDateRange.length === 0) {
      return res.send(200).json({
        transactions: [],
        status: "success",
        message: "No transactions found",
      });
    }

    return res.status(201).json({
      transactionsByDateRange,
      status: "success",
      message: "Here are all transactions",
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      error: error.message,
    });
  }
};

export const _addTransaction = async (req: Request, res: Response) => {
  const user_id = req.user?.user_id as number;
  
  try {
    const transactionData = req.body as ReqAddTransactionSchema;

    const newTransaction = await addTransaction(user_id, transactionData);

    res.status(201).json({
      transaction: newTransaction,
      status: "success",
      message: "Transaction added succesfully",
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      error: error.message,
    });
  }
};

export const _updateTransaction = async (req: Request, res: Response) => {
  const user_id = req.user?.user_id as number;
  
  const updatedTransactionData = req.body;

  try {
    
    const updatedTransaction = await updateTransaction(
      user_id,
      updatedTransactionData,
    );

    res.status(201).json({
      transaction: updatedTransaction,
      status: "success",
      message: "Transaction updated succesfully",
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      error: error.message,
    });
  }
};

export const _deleteTransaction = async (req:Request, res:Response)=>{
  const transaction_id = req.body.transaction_id;

  try {

    await deleteTransaction(transaction_id);

    res.status(201).json({
      status: "success",
      message: "Transaction deleted succesfully",
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      error: error.message,
    });
  }
}
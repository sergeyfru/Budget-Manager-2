import { Request, Response } from "express";
import {
  addTransaction,
  deleteTransaction,
  getTransactions,
  getTransactionsByDateRange,
  updateTransaction,
  getTransactionTypes,
} from "../models/transaction_models";
import { ReqCreateTransaction, ReqUpdateTransaction, ResSimple, ResTransactionDetailed, ResTransactionsDetailedArr, ResTransactionTypesArr } from "@shared/core";

export const _getTransactions = async (req: Request, res: Response<ResTransactionsDetailedArr>) => {
  const user_id = req.user?.user_id as number;
  console.log("Trying to get all transactions for user_id:", user_id);

  try {
    const transactions = await getTransactions(user_id);
    if (transactions.length === 0) {
      return res.status(200).json({
        data: [],
        status: "success",
        message: "No transactions found",
      });
    }

    res.status(200).json({
      data: transactions,
      status: "success",
      message: "Here are all transactions",
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const _getTransactionsByDateRange = async (
  req: Request,
  res: Response<ResTransactionsDetailedArr>,
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
      return res.status(200).json({
        data: [],
        status: "success",
        message: "No transactions found",
      });
    }

    return res.status(200).json({
      data: transactionsByDateRange,
      status: "success",
      message: "Here are all transactions",
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const _addTransaction = async (req: Request, res: Response<ResTransactionDetailed>) => {
  const user_id = req.user?.user_id as number;

  try {
    const transactionData = req.body as ReqCreateTransaction;

    const newTransaction = await addTransaction(user_id, transactionData);

    res.status(201).json({
      data: newTransaction,
      status: "success",
      message: "Transaction added succesfully",
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const _updateTransaction = async (req: Request, res: Response<ResTransactionDetailed>) => {
  const user_id = req.user?.user_id as number;
  const transaction_id = parseInt(req.params.id as string);

  const updatedTransactionData = req.body as ReqUpdateTransaction;

  try {
    const updatedTransaction = await updateTransaction(
      user_id,
      transaction_id,
      updatedTransactionData
    );

    res.status(201).json({
      data: updatedTransaction,
      status: "success",
      message: "Transaction updated succesfully",
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const _deleteTransaction = async (req: Request, res: Response<ResSimple>) => {
  const transaction_id = parseInt(req.params.id as string)

  try {
    await deleteTransaction(transaction_id);

    res.status(201).json({
      status: "success",
      message: "Transaction deleted succesfully",
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const _getTransactionTypes = async (req: Request, res: Response<ResTransactionTypesArr>) => {
  try {
    const transactionTypes = await getTransactionTypes();
    res.status(200).json({
      data: transactionTypes,
      status: "success",
      message: "Transaction types retrieved successfully",
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      status: "error",
      message: error.message,
    });
  }
};

import { parse } from "node:path";
import { db } from "../config/db";
import { ApiError } from "../errors/ApiErrors";
import { dbErrorHandler } from "../errors/db_errors";

import { getTransactionsQuery } from "../db/queries";
import { validateDB } from "../utils/validation";

import {
  ReqCreateTransaction, ReqUpdateTransaction,
  TransactionDetailed, transactionDetailedSchema,
  TransactionsDetailedArr, transactionsDetailedArrSchema,
  TransactionTypesArrDB, transactionTypesArrDBSchema
} from "@shared/core";

export const getTransactions = async (user_id: number): Promise<TransactionsDetailedArr> => {
  console.log("In models, getting transactions for user_id:", user_id);
  const trx = await db.transaction();
  try {
    const responseFromDB = await getTransactionsQuery(trx).where("tr.user_id", user_id);

    const transactions = validateDB(transactionsDetailedArrSchema, responseFromDB);

    trx.commit();
    return transactions;
  } catch (error) {
    trx.rollback();
    console.error("Error fetching transactions:", error);
    throw dbErrorHandler(error);
  }
};

export const getTransactionsByDateRange = async (
  user_id: number,
  start_date: Date,
  end_date: Date,
): Promise<TransactionsDetailedArr> => {
  console.log("In models, getting transactions in a date range for user_id:", user_id);
  const trx = await db.transaction();
  try {
    const responseFromDB = await getTransactionsQuery(trx)
      .where("tr.user_id", user_id)
      .andWhere("tr.date_of_transaction", ">=", start_date)
      .andWhere("tr.date_of_transaction", "<=", end_date);

    const transactionsByDateRange = validateDB(transactionsDetailedArrSchema, responseFromDB);

    trx.commit();

    return transactionsByDateRange;
  } catch (error) {
    trx.rollback();
    throw dbErrorHandler(error);
  }
};

export const addTransaction = async (
  user_id: number,
  transactionData: ReqCreateTransaction,
): Promise<TransactionDetailed> => {
  console.log("In models, adding transaction for user_id:", user_id);
  const trx = await db.transaction();
  try {
    console.log("Transaction data to insert:", transactionData);
    const [newTransaction] = await trx("transactions")
      .insert({  // insert transactionData as an object with the correct keys
        user_id,
        transaction_type_id: transactionData.transaction_type_id,
        user_payment_method_id: transactionData.user_payment_method_id,
        user_category_id: transactionData.user_category_id,
        transaction_amount: transactionData.transaction_amount,
        currency_id: transactionData.currency_id,
        date_of_transaction: transactionData.date_of_transaction,
        transaction_note: transactionData.transaction_note,
      })
      .returning(["transaction_id", "user_id"]);

    console.log("New transaction inserted with ID:", newTransaction);

    const responseFromDB = await getTransactionsQuery(trx)
      .where("tr.transaction_id", newTransaction.transaction_id)
      .first();
    console.log("Response from DB after inserting transaction:", responseFromDB);

    const newTransactionFull = validateDB(transactionDetailedSchema, responseFromDB);

    trx.commit();
    return newTransactionFull;
  } catch (error) {
    console.error("Error adding transaction:", error);
    trx.rollback();
    throw dbErrorHandler(error);
  }
};

export const updateTransaction = async (
  user_id: number,
  transaction_id: number,
  updatedTransactionData: ReqUpdateTransaction,
): Promise<TransactionDetailed> => {
  console.log("In models, updating transaction for user_id:", user_id);

  const trx = await db.transaction();
  try {

    const fieldsToUpdate = Object.fromEntries(Object.entries(updatedTransactionData).filter(([_, v]) => v !== undefined));

    if (Object.keys(fieldsToUpdate).length === 0) {
      throw new ApiError(400, "No fields to update");
    }

    await trx({ tr: "transactions" })
      .where({ "tr.user_id": user_id, "tr.transaction_id": transaction_id })
      .update(fieldsToUpdate);

    const responseFromDB = await getTransactionsQuery(trx).where("tr.transaction_id", transaction_id).first();

    const updatedTransaction = validateDB(transactionDetailedSchema, responseFromDB);

    trx.commit();
    return updatedTransaction;
  } catch (error) {
    console.error("Error updating transaction:", error);
    trx.rollback();
    throw dbErrorHandler(error);
  }
};

export const deleteTransaction = async (transaction_id: number): Promise<void> => {
  try {
    await db("transactions").where({ transaction_id }).delete().select("user_id", "transaction_id");

    return;
  } catch (error) {
    throw dbErrorHandler(error);
  }
};

export const getTransactionTypes = async (): Promise<TransactionTypesArrDB> => {
  try {
    const responseFromDB = await db("transaction_types").select(
      "transaction_type_id",
      "transaction_type_name",
      "transaction_type_direction",
      "transaction_type_icon",
      "transaction_type_color",
    );

    const transactionTypes = validateDB(transactionTypesArrDBSchema, responseFromDB);
    return transactionTypes;
  } catch (error) {
    console.error("Error fetching transaction types:", error);
    throw dbErrorHandler(error);
  }
};

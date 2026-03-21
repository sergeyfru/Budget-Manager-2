import { parse } from "node:path";
import { db } from "../config/db";
import { ApiError } from "../errors/ApiErrors";
import { dbErrorHandler } from "../errors/db_errors";
import {
  parseTransactionsResponse,
  ReqAddTransactionSchema,
  ReqUdateTransactionSchema,
  TransactionsResponseSchema,
} from "../schemas/transaction_schema";
import { getTransactionsQuery } from "../db/queries/transactions";

export const getTransactions = async (
  user_id: number,
): Promise<TransactionsResponseSchema> => {
  console.log("In models, getting transactions for user_id:", user_id);
  const trx = await db.transaction();
  try {
    const responseFromDB = await getTransactionsQuery(trx).where(
      "tr.user_id",
      user_id,
    );

    const transactions = parseTransactionsResponse(responseFromDB);
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
): Promise<TransactionsResponseSchema> => {
  console.log(
    "In models, getting transactions in a date range for user_id:",
    user_id,
  );
  const trx = await db.transaction();
  try {
    const responseFromDB = await getTransactionsQuery(trx)
      .where("tr.user_id", user_id)
      .andWhere("tr.date_of_transaction", ">=", start_date)
      .andWhere("tr.date_of_transaction", "<=", end_date);

    const transactionsByDateRange = parseTransactionsResponse(responseFromDB);

    trx.commit();

    return transactionsByDateRange;
  } catch (error) {
    trx.rollback();
    throw dbErrorHandler(error);
  }
};

export const addTransaction = async (
  user_id: number,
  transactionData: ReqAddTransactionSchema,
): Promise<TransactionsResponseSchema> => {
  console.log(
    "In models, adding transaction for user_id:",
    user_id,
  );
  const trx = await db.transaction();
  try {
    await db("transactions").insert({
      user_id,
      transaction_amount: transactionData.transaction_amount,
      date_of_transaction: transactionData.date_of_transaction,
      transaction_type_id: transactionData.transaction_type_id,
      user_category_id: transactionData.user_category_id,
      currency_id: transactionData.currency_id,
      user_payment_method_id: transactionData.user_payment_method_id,
      transaction_note: transactionData.transaction_note,
    });

    const responseFromDB = await getTransactionsQuery(trx).where("tr.user_id", user_id,);

    const transactions = parseTransactionsResponse(responseFromDB);

    trx.commit();

    return transactions;
  } catch (error) {
    trx.rollback();
    throw dbErrorHandler(error);
  }
};

export const updateTransaction = async (
  user_id: number,
  updatedTransactionData: ReqUdateTransactionSchema,
): Promise<TransactionsResponseSchema> => {
console.log(
    "In models, updating transaction for user_id:",
    user_id,
  );

  const trx = await db.transaction();
  try {
    const { transaction_id, ...fields } = updatedTransactionData;

    const fieldsToUpdate = Object.fromEntries(
      Object.entries(fields).filter(([_, v]) => v !== undefined),
    );

    if (Object.keys(fieldsToUpdate).length === 0) {
      throw new ApiError(400, "No fields to update");
    }

    await trx({ tr: "transactions" })
      .where({ "tr.user_id": user_id, "tr.transaction_id": transaction_id })
      .update(fieldsToUpdate);

    const responseFromDB = await getTransactionsQuery(trx).where("tr.user_id", user_id,);

    const transactions = parseTransactionsResponse(responseFromDB);

    trx.commit();
    return transactions;
  } catch (error) {
    trx.rollback();
    throw dbErrorHandler(error);
  }
};

export const deleteTransaction = async (transaction_id: number): Promise<TransactionsResponseSchema> => {
  const trx = await db.transaction();
  try {
   const deletedTransactin =  await trx("transactions").where({ transaction_id }).delete().select("uesr_id","transaction_id");
   const responseFromDB = await getTransactionsQuery(trx).where("tr.user_id", deletedTransactin.user_id,);

    const transactions = parseTransactionsResponse(responseFromDB);
    
    trx.commit();
    return transactions;
  } catch (error) {
    trx.rollback();
    throw dbErrorHandler(error);
  }
};

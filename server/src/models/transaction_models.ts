import { parse } from "node:path";
import { db } from "../config/db";
import { ApiError } from "../errors/ApiErrors";
import { dbErrorHandler } from "../errors/db_errors";
import {
  parseTransactionsResponse,
  ReqAddTransactionSchema,
  TransactionsResponseSchema,
} from "../schemas/transaction_schema";

export const getUsersTransactions = async (
  user_id: number,
): Promise<object | ApiError> => {
  console.log("Getting transactions for user_id:", typeof user_id);
  const trx = await db.transaction();
  try {
    const responseFromDB = await trx({ tr: "transactions" })
      // .innerJoin({u:"users"}, "tr.user_id",'=', "u.user_id")
      .innerJoin({ c: "currencies" }, "tr.currency_id", "c.currency_id")
      .innerJoin(
        { tt: "transaction_types" },
        "tr.transaction_type_id",
        "tt.transaction_type_id",
      )
      .innerJoin(
        { uc: "user_categories" },
        "tr.user_category_id",
        "uc.user_category_id",
      )
      .innerJoin(
        { upm: "user_payment_methods" },
        "tr.user_payment_method_id",
        "upm.user_payment_method_id",
      )
      .where("tr.user_id", user_id)
      .select(
        "tr.transaction_id",
        "tr.transaction_amount",
        "tr.date_of_transaction",
        "tr.transaction_note",
        "tr.created_at",
        trx.raw(`
        json_build_object(
          'currency_id', c.currency_id,
          'currency_code', c.currency_code,
          'currency_symbol', c.currency_symbol,
          'currency_name', c.currency_name
        ) as currency
      `),

        trx.raw(`
      json_build_object(
        'id', tt.transaction_type_id,
        'name', tt.transaction_type_name,
        'direction', tt.transaction_direction,
        'icon', tt.transaction_type_icon,
        'color', tt.transaction_type_color
      ) as transaction_type
    `),

        trx.raw(`
      json_build_object(
        'id', uc.user_category_id,
        'type_id', uc.category_type_id,
        'name', uc.user_category_name,
        'icon', uc.user_category_icon,
        'color', uc.user_category_color
      ) as user_category
    `),

        trx.raw(`
      json_build_object(
        'id', upm.user_payment_method_id,
        'type_id', upm.payment_method_type_id,
        'label', upm.user_payment_method_label,
        'details', upm.user_payment_method_details
      ) as user_payment_method
    `),
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

export const getUsersTransactionsByDateRange = async (
  user_id: number,
  start_date: Date,
  end_date: Date,
): Promise<TransactionsResponseSchema | { message: string } | ApiError> => {
  const trx = await db.transaction();

  try {
    const responseFromDB = await trx({ tr: "transactions" })
      //   .innerJoin({u:"users"}, "tr.user_id",'=', "u.user_id")
      .innerJoin({ c: "currencies" }, "tr.currency_id", "c.currency_id")
      .innerJoin(
        { tt: "transaction_types" },
        "tr.transaction_type_id",
        "tt.transaction_type_id",
      )
      .innerJoin(
        { uc: "user_categories" },
        "tr.user_category_id",
        "uc.user_category_id",
      )
      .innerJoin(
        { upm: "user_payment_methods" },
        "tr.user_payment_method_id",
        "upm.user_payment_method_id",
      )
      .where("tr.user_id", user_id)
      .andWhere("tr.date_of_transaction", ">=", start_date)
      .andWhere("tr.date_of_transaction", "<=", end_date)
      .select(
        "tr.transaction_id",
        "tr.transaction_amount",
        "tr.date_of_transaction",
        "tr.transaction_note",
        "tr.created_at",
        trx.raw(`
        json_build_object(
          'currency_id', c.currency_id,
          'currency_code', c.currency_code,
          'currency_symbol', c.currency_symbol,
          'currency_name', c.currency_name
        ) as currency
      `),

        trx.raw(`
      json_build_object(
        'id', tt.transaction_type_id,
        'name', tt.transaction_type_name,
        'direction', tt.transaction_direction,
        'icon', tt.transaction_type_icon,
        'color', tt.transaction_type_color
      ) as transaction_type
    `),

        trx.raw(`
      json_build_object(
        'id', uc.user_category_id,
        'type_id', uc.category_type_id,
        'name', uc.user_category_name,
        'icon', uc.user_category_icon,
        'color', uc.user_category_color
      ) as user_category
    `),

        trx.raw(`
      json_build_object(
        'id', upm.user_payment_method_id,
        'type_id', upm.payment_method_type_id,
        'label', upm.user_payment_method_label,
        'details', upm.user_payment_method_details
      ) as user_payment_method
    `),
      );
    const transactionsByDateRange = parseTransactionsResponse(responseFromDB);
    if (transactionsByDateRange.length === 0) {
      return { message: "No transactions found for the specified date range" };
    }
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
): Promise<object | ApiError> => {
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

    const responseFromDB = await trx({ tr: "transactions" })
      .innerJoin({ c: "currencies" }, "tr.currency_id", "c.currency_id")
      .innerJoin(
        { tt: "transaction_types" },
        "tr.transaction_type_id",
        "tt.transaction_type_id",
      )
      .innerJoin(
        { uc: "user_categories" },
        "tr.user_category_id",
        "uc.user_category_id",
      )
      .innerJoin(
        { upm: "user_payment_methods" },
        "tr.user_payment_method_id",
        "upm.user_payment_method_id",
      )
      .where("tr.user_id", user_id)
      .select(
        "tr.transaction_id",
        "tr.transaction_amount",
        "tr.date_of_transaction",
        "tr.transaction_note",
        "tr.created_at",
        trx.raw(`
        json_build_object(
          'currency_id', c.currency_id,
          'currency_code', c.currency_code,
          'currency_symbol', c.currency_symbol,
          'currency_name', c.currency_name
        ) as currency
      `),

        trx.raw(`
      json_build_object(
        'id', tt.transaction_type_id,
        'name', tt.transaction_type_name,
        'direction', tt.transaction_direction,
        'icon', tt.transaction_type_icon,
        'color', tt.transaction_type_color
      ) as transaction_type
    `),

        trx.raw(`
      json_build_object(
        'id', uc.user_category_id,
        'type_id', uc.category_type_id,
        'name', uc.user_category_name,
        'icon', uc.user_category_icon,
        'color', uc.user_category_color
      ) as user_category
    `),

        trx.raw(`
      json_build_object(
        'id', upm.user_payment_method_id,
        'type_id', upm.payment_method_type_id,
        'label', upm.user_payment_method_label,
        'details', upm.user_payment_method_details
      ) as user_payment_method
    `),
      );
      const transactions = parseTransactionsResponse(responseFromDB);

    trx.commit();

    return transactions;
  } catch (error) {
    trx.rollback();
    throw dbErrorHandler(error);
  }
};

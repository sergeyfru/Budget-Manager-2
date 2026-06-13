import { z } from "zod";
import { currencyDBSchema, userCategorySchema, userPaymentMethodSchema } from "@shared/core";
import { createApiResponseSchema } from "../api_utils.js";

//
// ======================================================
// 🔹 TRANSACTION TYPES
// ======================================================
//

// DB
export const transactionTypeDBSchema = z.object({
  transaction_type_id: z.number(),
  transaction_type_name: z.string(),
  transaction_type_direction: z.enum(["in", "out"]),
  transaction_type_icon: z.string().nullable(),
  transaction_type_color: z.string(),
});

export type TransactionTypeDB = z.infer<typeof transactionTypeDBSchema>;

// ARRAY DB
export const transactionTypesArrDBSchema = z.array(transactionTypeDBSchema);

export type TransactionTypesArrDB = z.infer<typeof transactionTypesArrDBSchema>;

// RESPONSE
export const resTransactionTypesArrSchema = createApiResponseSchema(transactionTypesArrDBSchema);

export type ResTransactionTypesArr = z.infer<typeof resTransactionTypesArrSchema>;

// VIEW (embedded)
export const transactionTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
  direction: z.enum(["in", "out"]),
  icon: z.string().nullable(),
  color: z.string(),
});

export type TransactionTypeSchema = z.infer<typeof transactionTypeSchema>;

//
// ======================================================
// 🔹 USER TRANSACTIONS (BASE)
// ======================================================
//

// DB
export const transactionDBSchema = z.object({
  transaction_id: z.number(),
  user_id: z.number(),

  transaction_type_id: z.number(),
  user_payment_method_id: z.number(),
  user_category_id: z.number(),

  transaction_amount: z.coerce.number("Amount is required").min(0.01, "Amount must be greater than 0"),
  // currency_id: z.number(),
  transaction_currency_id: z.number(),
  fx_rate_to_base: z.number(),
  actual_base_amount: z.number(),
  base_currency_id: z.number(),

  // date_of_transaction: z.coerce.date(),
  date_of_transaction: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  transaction_note: z.string().nullable(),
  update_at_unix: z.number().int().nonnegative(),
  created_at: z.coerce.date(),
});

export type TransactionDB = z.infer<typeof transactionDBSchema>;

//
// ======================================================
// 🔹 USER TRANSACTION (DETAILED VIEW)
// ======================================================
//

export const transactionDetailedSchema = z.object({
  transaction_id: z.number(),
  transaction_amount: z.coerce.number("Amount is required").min(0.01, "Amount must be greater than 0"),

  fx_rate_to_base: z.coerce.number(),
  actual_base_amount: z.coerce.number(),
  base_currency_id: z.number(),
  transaction_currency_id: z.number(),
  transaction_type_id: z.number(),
  user_category_id: z.number(),
  user_payment_method_id: z.number(),
  updated_at_unix: z.number().int().nonnegative(),
  transaction_note: z.string().nullable(),

  // date_of_transaction: z.coerce.date(),
  date_of_transaction: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),

  currency: currencyDBSchema,
  transaction_type: transactionTypeSchema,
  user_category: userCategorySchema,
  user_payment_method: userPaymentMethodSchema,
  created_at: z.coerce.date(),
});

export type TransactionDetailed = z.infer<typeof transactionDetailedSchema>;

// ARRAY
export const transactionsDetailedArrSchema = z.array(transactionDetailedSchema);

export type TransactionsDetailedArr = z.infer<typeof transactionsDetailedArrSchema>;

//
// ======================================================
// 🔹 CREATE TRANSACTION
// ======================================================
//

// FORM / REQUEST
export const createTransactionFormSchema = z.object({
  transaction_type_id: z.number("Transaction type is required").min(1, "Transaction type is required"),
  user_payment_method_id: z.number("Payment method is required"),
  user_category_id: z.number("Category is required"),
  transaction_amount: z.number("Amount is required").min(0.01, "Amount must be greater than 0"),
  // currency_id: z.number(),

  transaction_currency_id: z.number().min(1, "Currency is required"),
  fx_rate_to_base: z.number(),
  actual_base_amount: z.number(),
  base_currency_id: z.number(),
  date_of_transaction: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  // date_of_transaction: z.coerce.date(),
  transaction_note: z.string().nullable(),
});

export type CreateTransactionFormValues = z.infer<typeof createTransactionFormSchema>;

export type CreateTransactionForm = z.input<typeof createTransactionFormSchema>;

export type ReqCreateTransaction = z.infer<typeof createTransactionFormSchema>;

//
// ======================================================
// 🔹 UPDATE TRANSACTION
// ======================================================
//

export const updateTransactionFormSchema = createTransactionFormSchema.partial();

export type UpdateTransactionForm = z.infer<typeof updateTransactionFormSchema>;

// REQUEST
export const reqUpdateTransactionSchema = updateTransactionFormSchema;

export type ReqUpdateTransaction = z.infer<typeof reqUpdateTransactionSchema>;

//
// ======================================================
// 🔹 DELETE TRANSACTION
// ======================================================
//

//    REQUEST : transaction_id comes in the URL as a params

//    RESPONSE : response as a ResSimple

//
// ======================================================
// 🔹 RESPONSE TRANSACTIONS
// ======================================================
//

// SINGLE
export const resTransactionDetailedSchema = createApiResponseSchema(transactionDetailedSchema);

export type ResTransactionDetailed = z.infer<typeof resTransactionDetailedSchema>;

// ARRAY
export const resTransactionsDetailedArrSchema = createApiResponseSchema(transactionsDetailedArrSchema);

export type ResTransactionsDetailedArr = z.infer<typeof resTransactionsDetailedArrSchema>;

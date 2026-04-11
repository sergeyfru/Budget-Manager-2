import { z } from "zod";
import { currencyDBSchema, userCategorySchema, userPaymentMethodSchema } from "@shared/core";
import { createApiResponseSchema } from "../api_utils";


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
export const resTransactionTypesArrSchema = createApiResponseSchema(
  transactionTypesArrDBSchema
);

export type ResTransactionTypesArr = z.infer<
  typeof resTransactionTypesArrSchema
>;

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

  transaction_amount: z.string(),
  currency_id: z.number(),

  date_of_transaction: z.coerce.date(),
  transaction_note: z.string().nullable(),

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
  transaction_amount: z.string().transform((val) => parseFloat(val)),
  date_of_transaction: z.coerce.date(),
  transaction_note: z.string().nullable(),

  currency: currencyDBSchema,
  transaction_type: transactionTypeSchema,
  user_category: userCategorySchema,
  user_payment_method: userPaymentMethodSchema,
});

export type TransactionDetailed = z.infer<typeof transactionDetailedSchema>;

// ARRAY
export const transactionsDetailedArrSchema = z.array(transactionDetailedSchema);

export type TransactionsDetailedArr = z.infer<
  typeof transactionsDetailedArrSchema
>;


//
// ======================================================
// 🔹 CREATE TRANSACTION
// ======================================================
//

// FORM / REQUEST
export const createTransactionFormSchema = z.object({
  transaction_type_id: z.coerce.number(),
  user_payment_method_id: z.coerce.number(),
  user_category_id: z.coerce.number(),
  transaction_amount: z.coerce.number(),
  currency_id: z.coerce.number(),
  date_of_transaction: z.coerce.date(),
  transaction_note: z.string().optional(),
});

export type CreateTransactionForm = z.input<
  typeof createTransactionFormSchema
>;

export type ReqCreateTransaction = z.infer<typeof createTransactionFormSchema>;


//
// ======================================================
// 🔹 UPDATE TRANSACTION
// ======================================================
//

export const updateTransactionFormSchema =
  createTransactionFormSchema.partial();

export type UpdateTransactionForm = z.infer<
  typeof updateTransactionFormSchema
>;

// REQUEST
export const reqUpdateTransactionSchema = updateTransactionFormSchema;

export type ReqUpdateTransaction = z.infer<
  typeof reqUpdateTransactionSchema
>;


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
export const resTransactionDetailedSchema = createApiResponseSchema(
  transactionDetailedSchema
);

export type ResTransactionDetailed = z.infer<
  typeof resTransactionDetailedSchema
>;

// ARRAY
export const resTransactionsDetailedArrSchema = createApiResponseSchema(
  transactionsDetailedArrSchema
);

export type ResTransactionsDetailedArr = z.infer<
  typeof resTransactionsDetailedArrSchema
>;
import Api from "twilio/lib/rest/Api";
import { z } from "zod";
import { ApiError } from "../errors/ApiErrors";

export const currencySchema = z.object({
  currency_id: z.number(),
  currency_code: z.string(),
  currency_symbol: z.string().nullable(),
  currency_name: z.string(),
});
export type CurrencySchema = z.infer<typeof currencySchema>;

export const transactionTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
  direction: z.enum(["in", "out"]),
  icon: z.string().nullable(),
  color: z.string(),
});
export type TransactionTypeSchema = z.infer<typeof transactionTypeSchema>;

export const userCategorySchema = z.object({
  id: z.number(),
  type_id: z.number(),
  name: z.string(),
  icon: z.string().nullable(),
  color: z.string(),
});
export type UserCategorySchema = z.infer<typeof userCategorySchema>;

export const userPaymentMethodSchema = z.object({
  id: z.number(),
  type_id: z.number(),
  label: z.string(),
  details: z.string().nullable(),
});
export type UserPaymentMethodSchema = z.infer<typeof userPaymentMethodSchema>;

export const transactionFullSchema = z.object({
  transaction_id: z.number(),
  transaction_amount: z.string().transform((val) => parseFloat(val)), // NUMERIC из PostgreSQL приходит строкой
  date_of_transaction: z.date(),
  transaction_note: z.string().nullable(),

  currency: currencySchema,
  transaction_type: transactionTypeSchema,
  user_category: userCategorySchema,
  user_payment_method: userPaymentMethodSchema,
});
export type TransactionFullSchema = z.infer<typeof transactionFullSchema>;

export const transactionsResponseSchema = z.array(transactionFullSchema);
export type TransactionsResponseSchema = z.infer<
  typeof transactionsResponseSchema
>;
export const parseTransactionsResponse = (data: any): TransactionsResponseSchema => {
  try {
    const transaction = transactionsResponseSchema.parse(data);
    console.log("✅ Valid transaction:", transaction);
    return transaction;
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.error("❌ Invalid transaction data:", err);
      throw new ApiError(500, "Invalid transaction data format");
    }
    throw err;
  }
};

export const transactionDbSchema = z.object({
  transaction_id: z.number(),
  user_id: z.number(),
  transaction_type_id: z.number(),
  user_payment_method_id: z.number(),
  user_category_id: z.number(),

  transaction_amount: z.string(),
  currency_id: z.number(),

  date_of_transaction: z.date(),
  transaction_note: z.string().nullable(),
  created_at: z.date(),
});

export type TransactionDbSchema = z.infer<typeof transactionDbSchema>;

export const reqAddTransactionSchema = z.object({
  transaction_type_id: z.number(),
  user_payment_method_id: z.number(),
  user_category_id: z.number(),

  transaction_amount: z.number(),
  currency_id: z.number(),

  date_of_transaction: z.date().optional(),
  transaction_note: z.string().optional(),
});

export type ReqAddTransactionSchema = z.infer<typeof reqAddTransactionSchema>;

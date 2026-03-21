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

export const transactionsResponseArraySchema = z.array(transactionFullSchema);
export type TransactionsResponseSchema = z.infer<
  typeof transactionsResponseArraySchema
>;

// export const parseTransactionsArrayResponse = (
//   data: any,
// ): TransactionsResponseSchema => {
//   try {
//     const transaction = transactionsResponseArraySchema.parse(data);
//     console.log("✅ Valid transaction:", transaction);
//     return transaction;
//   } catch (err) {
//     if (err instanceof z.ZodError) {
//       console.error("❌ Invalid transaction data:", err);
//       throw new ApiError(500, "Invalid transaction data format");
//     }
//     throw err;
//   }
// };

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

export const reqUpdateTransactionSchema = reqAddTransactionSchema
  .partial()
  .extend({
    transaction_id: z.number(),
  });

export type ReqUpdateTransactionSchema = z.infer<
  typeof reqUpdateTransactionSchema
>;


// ### Categories 


export const defaultCategoryTypeDBSchema = z.object({
  category_type_id: z.number(),
  category_type_name: z.string(),
  category_type_icon: z.string().nullable(),
  category_type_color: z.string(),
});

export type DefaultCategoryTypeDBSchema = z.infer<typeof defaultCategoryTypeDBSchema>;

export const defaultCategoryTypesArrDBSchema = z.array(defaultCategoryTypeDBSchema);

export type DefaultCategoryTypesArrDBSchema = z.infer<typeof defaultCategoryTypesArrDBSchema>;



export const userCategoryDBSchema = z.object({
  user_category_id: z.number(),
  user_id: z.number(),
  category_type_id: z.number(),
  user_category_name: z.string(),
  user_category_icon: z.string().nullable(),
  user_category_color: z.string(),
  created_at: z.date().optional(),
});
export type UserCategoryDBSchema = z.infer<typeof userCategoryDBSchema>;

export const userCategoriesArrDBSchema = z.array(userCategoryDBSchema);

export type UserCategoriesArrDBSchema = z.infer<typeof userCategoriesArrDBSchema>;

export const reqCreateUserCategorySchema = userCategoryDBSchema
  .omit({ user_category_id: true});
export type ReqCreateUserCategorySchema = z.infer<typeof reqCreateUserCategorySchema>;

export const reqUpdateUserCategorySchema = reqCreateUserCategorySchema.partial().omit({ user_id: true, category_type_id: true , created_at: true});
export type ReqUpdateUserCategorySchema = z.infer<typeof reqUpdateUserCategorySchema>;

// ### Payment Methods

export const defaultPaymentMethodTypeDBSchema = z.object({
  payment_method_type_id: z.number(),
  payment_method_type_name: z.string(),
  payment_method_type_icon: z.string().nullable(),
  payment_method_type_color: z.string(),
})
export type DefaultPaymentMethodTypeDBSchema = z.infer<typeof defaultPaymentMethodTypeDBSchema>;

export const defaultPaymentMethodTypesArrDBSchema = z.array(defaultPaymentMethodTypeDBSchema);

export type DefaultPaymentMethodTypesArrDBSchema = z.infer<typeof defaultPaymentMethodTypesArrDBSchema>;


export const userPaymentMethodDBSchema = z.object({
  user_payment_method_id: z.number(),
  user_id: z.number(),
  payment_method_type_id: z.number(),
  user_payment_method_icon: z.string().nullable(),
  user_payment_method_color: z.string(),
  user_payment_method_details: z.string(),
});


export type UserPaymentMethodDBSchema = z.infer<typeof userPaymentMethodDBSchema>;

export const userPaymentMethodsArrDBSchema = z.array(userPaymentMethodDBSchema);

export type UserPaymentMethodsArrDBSchema = z.infer<typeof userPaymentMethodsArrDBSchema>;

//   data: any,
// ): UserPaymentMethodsArrDBSchema => {
//   try {
//     const response = userPaymentMethodsArrDBSchema.safeParse(data);
//     if (!response.success) {
//       console.error("❌ Invalid user payment methods:", response.error);
//       throw new ApiError(500, "Invalid DB response: user payment methods");
//     }

//     console.log("✅ Valid User Payment Methods:", response.data);
//     return response.data;
//   } catch (err) {
//     console.error(err)
//     throw err;
//   }
// };
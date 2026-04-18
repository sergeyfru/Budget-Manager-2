import { Knex } from "knex";

export const getTransactionsQuery = (trx: Knex): Knex.QueryBuilder => {
  return trx({ tr: "transactions" })
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
          'currency_name', c.currency_name,
          'created_at', c.created_at
        ) as currency
      `),

      trx.raw(`
      json_build_object(
        'id', tt.transaction_type_id,
        'name', tt.transaction_type_name,
        'direction', tt.transaction_type_direction,
        'icon', tt.transaction_type_icon,
        'color', tt.transaction_type_color
      ) as transaction_type
    `),

      trx.raw(`
      json_build_object(
        'id', uc.user_category_id,
        'allowed_direction', uc.user_category_allowed_direction,
        'name', uc.user_category_name,
        'icon', uc.user_category_icon,
        'color', uc.user_category_color
      ) as user_category
    `),

      trx.raw(`
      json_build_object(
        'id', upm.user_payment_method_id,
        'type_id', upm.payment_method_type_id,
        'name', upm.user_payment_method_name,
        'icon', upm.user_payment_method_icon,
        'color', upm.user_payment_method_color,
        'details', upm.user_payment_method_details
      ) as user_payment_method
    `),
    ).orderBy("tr.date_of_transaction", "desc");
};

export const getDefaultCategoriesQuery = (trx: Knex): Knex.QueryBuilder => {
  return trx("category_types").select(
    "category_id",
    "category_name",
    "category_allowed_direction",
    "category_icon",
    "category_color",
  );
};

export const getDefaultPaymentMethodsQuery = (trx: Knex): Knex.QueryBuilder => {
  return trx("payment_method_types").select(
    "payment_method_type_id",
    "payment_method_type_name",
    "payment_method_type_icon",
    "payment_method_type_color",

  );
};
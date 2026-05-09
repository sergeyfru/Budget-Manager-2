import { zodResolver } from "@hookform/resolvers/zod";
import { createTransactionFormSchema, type ReqCreateTransaction } from "@shared/core";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useTransactionStore } from "../../store/transactionsStore";
import { useEffect } from "react";
import { usePaymentMethods } from "../../store/paymentMethodsStore";
import { useSettingsStore } from "../../store/settingsStore";
import { useCurrenciesStore } from "../../store/currenciesStore";
import { useCategoriesStore } from "../../store/categoriesStore";

interface AddTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTransactionModal({ open, onOpenChange }: AddTransactionModalProps) {
  const { transactionTypes, transactionTypesStatus, getTransactionTypes, addTransaction } = useTransactionStore();
  const { categories, categoriesStatus } = useCategoriesStore();
  const { paymentMethodsStatus, paymntentMethods, getUserPaymentMethods } = usePaymentMethods();
  const { currencies, currenciesStatus, getCurrencies } = useCurrenciesStore();
  const { defaultCurrency } = useSettingsStore();

  useEffect(() => {
    if (transactionTypes.length === 0) {
      getTransactionTypes();
    }
    if (paymntentMethods.length === 0) {
      getUserPaymentMethods();
    }
    if (currencies.length === 0) {
      getCurrencies();
    }
  }, [transactionTypes.length, paymntentMethods.length, currencies.length]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createTransactionFormSchema),
    defaultValues: {
      currency_id: defaultCurrency?.currency_id || 3,
      date_of_transaction: new Date()
    },
  });

  const watchValues = useWatch({ control });


  const selectedCurrency = watch("currency_id");

  const onFormSubmit = async (data: ReqCreateTransaction) => {
    console.log("Form submitted with values:", data);
    try {
      addTransaction(data)
      
      closeModal();

    } catch (error) {
      
    }
    
  };

  const onFormChange = () => {
    console.log("Form Changed:", watchValues);
  };

  const closeModal = () => {
    reset();
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-1">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-card rounded-2xl shadow-lg">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Add Transaction</h2>
            <button onClick={closeModal} className="rounded-full p-2 hover:bg-gray-100 transition-colors">
              ✕
            </button>
          </div>
        </div>

        {/* Form */}
        <form onChange={onFormChange} onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
          {/* Type Toggle */}
          <div className="space-y-2">
            <Controller
              name="transaction_type_id"
              control={control}
              rules={{ required: "Transaction type is required" }}
              render={({ field }) => (
                <div className="flex gap-2">
                  {transactionTypesStatus === "loading" ? (
                    <p>Loading transaction types...</p>
                  ) : transactionTypesStatus === "error" ? (
                    <p className="text-sm text-destructive">Failed to load transaction types</p>
                  ) : (
                    transactionTypes.slice(0, 2).map((type) => {
                      const isActive = field.value === type.transaction_type_id;

                      return (
                        <button
                          key={type.transaction_type_id}
                          type="button"
                          onClick={() => field.onChange(type.transaction_type_id)}
                          className={`flex-1 py-3 rounded-xl font-medium shadow-md transition-all
                ${
                  isActive && type.transaction_type_direction === "out"
                    ? "bg-destructive text-destructive-foreground border-destructive"
                    : isActive && type.transaction_type_direction === "in"
                      ? "bg-success text-success-foreground border-success hover:bg-success/90"
                      : "bg-accent text-accent-foreground border-border hover:bg-secondary"
                }`}
                        >
                          {type.transaction_type_name}
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            />
            {errors.transaction_type_id && (
              <p className="text-sm text-destructive flex items-center gap-1.5">
                {/* <span className="inline-block w-1 h-1 rounded-full bg-destructive" /> */}
                {errors.transaction_type_id.message}
              </p>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount *</label>

            <div className="relative">
              {/* Icon */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                {currenciesStatus === "error" ? null : (
                  <span>{currencies.find((c) => c.currency_id === selectedCurrency)?.currency_symbol || "₪"}</span>
                )}
              </div>

              {/* Input */}
              <input
                {...register("transaction_amount", { valueAsNumber: true })}
                type="number"
                min="0"
                placeholder="0.00"
                className={`w-full text-3xl h-16 pl-12 pr-24 font-semibold border rounded-xl 
                  ${
                    errors.transaction_amount
                      ? "border-destructive focus:border-destructive"
                      : // : "border-transparent focus:border-primary focus:bg-card"
                        "focus:outline-none focus:ring-2 focus:ring-blue-500"
                  }
                  `}
              />

              {/* Currency */}
              <select
                {...register("currency_id", { valueAsNumber: true })}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-2 rounded-md bg-gray-100 text-sm"
              >
                {currenciesStatus === "loading" ? (
                  <option>Loading...</option>
                ) : currenciesStatus === "error" ? (
                  <option>Error loading currencies</option>
                ) : (
                  currencies.map((currency) => {
                    return (
                      <option key={currency.currency_id} value={currency.currency_id}>
                        {currency.currency_code}
                      </option>
                    );
                  })
                )}
              </select>
            </div>
            {/* <div className="flex justify-between"> */}
            {errors.transaction_amount && (
              <p className="text-sm text-destructive flex items-center gap-1.5 ">
                {/* <span className="inline-block w-1 h-1 rounded-full bg-destructive" /> */}
                {errors.transaction_amount.message}
              </p>
            )}
            {selectedCurrency !== defaultCurrency?.currency_id && (
              <p className="mt-2 text-sm text-muted-foreground">
                The amount will be converted and displayed in your preferred currency.
              </p>
            )}
            {/* </div> */}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Category *</label>
            <select
              {...(register("user_category_id", { valueAsNumber: true }))}
              defaultValue=""
              className={`w-full h-12 px-3 border rounded-xl
                ${
                  errors.user_category_id
                    ? "border-destructive focus:border-destructive"
                    : // : "border-transparent focus:border-primary focus:bg-card"
                      "focus:outline-none focus:ring-2 focus:ring-blue-500"
                }
                  `}
            >
              <option value={""} disabled>
                Select Category
              </option>
              {categoriesStatus === "loading" ? (
                <option disabled>Loading categories..</option>
              ) : categoriesStatus === "error" ? (
                <option disabled>Failed to load categories</option>
              ) : (
                categories.map((category) => (
                  <option 
                    key={category.user_category_id} 
                    value={category.user_category_id}>
                    {category.user_category_name}
                  </option>
                ))
              )}
            </select>
            {errors.user_category_id ? (
              <p className="text-sm text-destructive">{errors.user_category_id.message}</p>
            ) : null}
          </div>
          {/* </div> */}

          {/* Payment Method */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Method</label>
            <select
              {...register("user_payment_method_id", { valueAsNumber: true })}
              defaultValue=""
              className={`w-full h-12 px-3 border rounded-xl 
                          ${
                            errors.user_payment_method_id
                              ? "border-destructive focus:border-destructive"
                              : // : "border-transparent focus:border-primary focus:bg-card"
                                " focus:outline-none focus:ring-2 focus:ring-blue-500"
                          }
                        `}
            >
              <option value="" disabled>
                Select Payment Method
              </option>
              {paymentMethodsStatus === "loading" ? (
                <option>Loading payment methods...</option>
              ) : paymentMethodsStatus === "error" ? (
                <option>Failed to load payment methods</option>
              ) : (
                paymntentMethods.map((method) => (
                  <option key={method.user_payment_method_id} value={method.user_payment_method_id}>
                    {method.user_payment_method_name}
                  </option>
                ))
              )}
            </select>
            {errors.user_payment_method_id ? (
              <p className="text-sm text-destructive">{errors.user_payment_method_id.message}</p>
            ) : null}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <input
              type="date"
              {...register("date_of_transaction", { valueAsDate: true })}
              className={`w-full h-12 px-3 border rounded-xl 
                          ${
                            errors.date_of_transaction
                              ? "border-destructive focus:border-destructive"
                              : // : "border-transparent focus:border-primary focus:bg-card"
                                "focus:outline-none focus:ring-2 focus:ring-blue-500"
                          }
                        `}
            />
            {errors.date_of_transaction && (
              <p className="text-sm text-destructive">{errors.date_of_transaction.message}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes (optional)</label>
            <textarea
              {...register("transaction_note")}
              className="w-full h-20 px-3 py-2 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add any additional notes..."
            />
            {errors.transaction_note && (
              <p className="text-sm text-destructive flex items-center gap-1.5">
                {/* <span className="inline-block w-1 h-1 rounded-full bg-destructive" /> */}
                {errors.transaction_note.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={closeModal} className="flex-1 h-12 border rounded-xl hover:bg-gray-100">
              Cancel
            </button>
            <button type="submit" className="flex-1 h-12 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
              Add Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

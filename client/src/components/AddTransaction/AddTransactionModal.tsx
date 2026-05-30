import { zodResolver } from "@hookform/resolvers/zod";
import { createTransactionFormSchema, type ReqCreateTransaction, type TransactionDB } from "@shared/core";
import { Controller, useForm } from "react-hook-form";
import { useTransactionStore } from "../../store/transactionsStore";
import { useEffect } from "react";
import { usePaymentMethodsStore } from "../../store/paymentMethodsStore";
import { useSettingsStore } from "../../store/settingsStore";
import { useCurrenciesStore } from "../../store/currenciesStore";
import { useCategoriesStore } from "../../store/categoriesStore";
import { useModalsStore } from "../../store/modalsStore";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { ModalFormContainer } from "../ModalComponents/ModalContainer";

interface AddTransactionModalProps {
  dataForUpdate: TransactionDB | null;
}

const AddTransactionModal = ({ dataForUpdate }: AddTransactionModalProps) => {
  const { transactionTypes, transactionTypesStatus, getTransactionTypes, addTransaction, updateTransaction } =
    useTransactionStore();
  const { categories, categoriesStatus } = useCategoriesStore();
  const { paymentMethodsStatus, paymentMethods, getUserPaymentMethods } = usePaymentMethodsStore();
  const { currencies, currenciesStatus, getCurrencies } = useCurrenciesStore();
  const { defaultCurrency } = useSettingsStore();
  const { resetTransactionModalStore } = useModalsStore();
  const {getUserCategories} = useCategoriesStore()

  useEffect(() => {
    if (transactionTypes.length === 0) {
      getTransactionTypes();
    }
    if (paymentMethods.length === 0) {
      getUserPaymentMethods();
    }
    if (currencies.length === 0) {
      getCurrencies();
    }
    if(categories.length === 0){
      getUserCategories()
    }
    if (dataForUpdate) {
      reset({
        ...dataForUpdate,
        date_of_transaction: new Date(dataForUpdate.date_of_transaction).toISOString().split("T")[0],
      });
    }
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createTransactionFormSchema),
    defaultValues: {
      currency_id: defaultCurrency?.currency_id || 3,
      date_of_transaction: new Date().toISOString().split("T")[0],
    },
  });

  const selectedCurrency = watch("currency_id");
  const isEditing = !!dataForUpdate;
  const onFormSubmit = async (data: ReqCreateTransaction) => {
    try {
      if (isEditing && dataForUpdate) {
        const dataChanged = Object.fromEntries(
          Object.entries(data).filter(([key, value]) => value !== dataForUpdate[key as keyof typeof dataForUpdate]),
        );
        updateTransaction(dataForUpdate.transaction_id, dataChanged);
      } else {
        addTransaction(data);
      }
      closeModal();
    } catch (err: any) {
      const data = (err as AxiosError)?.response?.data || err;
      if (data?.errors) {
        data.errors.forEach((e: any) => {
          console.log(e.field, { message: e.message });
          setError(e.field, { message: `${e.message}` });
        });
        return;
      }
      if (data?.message) {
        toast.error(data.message);
        return;
      }
      toast.error("An unexpected error occurred");
      console.error("Login error:", data);
    }
  };

  const closeModal = () => {
    resetTransactionModalStore();
  };

  return (
    <ModalFormContainer
      title={isEditing ? "Update Transaction" : "Add Transaction"}
      closeModal={closeModal}
      disabled={isSubmitting}
      onSubmit={handleSubmit(onFormSubmit)}
      fullScrin
    >
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
                <p className="text-sm text-destructive-foreground">Failed to load transaction types</p>
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
                    ? "bg-destructive/40 text-destructive-foreground border-destructive"
                    : isActive && type.transaction_type_direction === "in"
                      ? "bg-success/60 text-success-foreground border-success"
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
          <p className="text-sm text-destructive-foreground flex items-center gap-1.5">
            {/* <span className="inline-block w-1 h-1 rounded-full bg-destructive" /> */}
            {errors.transaction_type_id.message}
          </p>
        )}
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Amount *
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
              className={`
                  absolute right-2 top-1/2 -translate-y-1/2
                  h-10 px-2 pr-8 rounded-md bg-accent
                  text-foreground border border-border text-sm
                  focus:outline-none focus:ring-2 focus:ring-ring/50
                `}
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
        </label>
        {/* <div className="flex justify-between"> */}
        {errors.transaction_amount && (
          <p className="text-sm text-destructive-foreground flex items-center gap-1.5 ">
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
        <label className="text-sm font-medium">
          Category *
          <select
            {...register("user_category_id", { valueAsNumber: true })}
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
                <option key={category.user_category_id} value={category.user_category_id}>
                  {category.user_category_name}
                </option>
              ))
            )}
          </select>
          {errors.user_category_id ? (
            <p className="text-sm text-destructive-foreground">{errors.user_category_id.message}</p>
          ) : null}
        </label>
      </div>
      {/* </div> */}

      {/* Payment Method */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Payment Method
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
              paymentMethods.map((method) => (
                <option key={method.user_payment_method_id} value={method.user_payment_method_id}>
                  {method.user_payment_method_name}
                </option>
              ))
            )}
          </select>
          {errors.user_payment_method_id ? (
            <p className="text-sm text-destructive-foreground">{errors.user_payment_method_id.message}</p>
          ) : null}
        </label>
      </div>

      {/* Date */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Date
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
            <p className="text-sm text-destructive-foreground">{errors.date_of_transaction.message}</p>
          )}
        </label>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Notes (optional)
          <textarea
            {...register("transaction_note")}
            className="w-full h-20 px-3 py-2 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add any additional notes..."
          />
          {errors.transaction_note && (
            <p className="text-sm text-destructive-foreground flex items-center gap-1.5">
              {/* <span className="inline-block w-1 h-1 rounded-full bg-destructive" /> */}
              {errors.transaction_note.message}
            </p>
          )}
        </label>
      </div>
    </ModalFormContainer>
  );
};

export default AddTransactionModal;

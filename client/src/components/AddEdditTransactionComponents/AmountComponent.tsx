import type { CreateTransactionForm, CurrencyDB, TransactionDB } from "@shared/core";
import type { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { useCurrenciesStore } from "../../store/currenciesStore";
import { useEffect, useMemo } from "react";

interface AmountComponentProps {
  watch: UseFormWatch<CreateTransactionForm>;
  errors: FieldErrors<CreateTransactionForm>;
  defaultCurrency: CurrencyDB;
  setValue: UseFormSetValue<CreateTransactionForm>;
  register: UseFormRegister<CreateTransactionForm>;
  dataForUpdate: TransactionDB | null;
}

export const AmountComponent = ({
  watch,
  errors,
  register,
  defaultCurrency,
  setValue,
  dataForUpdate,
}: AmountComponentProps) => {
  const isEditing = !!dataForUpdate;

  const { currencies, currenciesStatus } = useCurrenciesStore();

  const selectedCurrency = watch("transaction_currency_id");
  const fullSelectedCurrency = currencies.find((c) => c.currency_id === selectedCurrency);
  const enteredAmount = watch("transaction_amount");

  const calculatingAmountInBaseCurrency = useMemo(() => {
    const amount = Number(enteredAmount || 0);

    const rateExchangeCurrency = currencies.find((currency) => currency.currency_id === selectedCurrency);

    if (!rateExchangeCurrency || !defaultCurrency) {
      return {
        baseAmount: 0,
        rate: 0,
        rateExchangeCurrency: null,
      };
    }

    const rate =
      isEditing && dataForUpdate.transaction_currency_id === rateExchangeCurrency.currency_id
        ? dataForUpdate.fx_rate_to_base
        : Number(defaultCurrency.currency_exchange_rate_usd) / Number(rateExchangeCurrency.currency_exchange_rate_usd);

    const baseAmount = amount * rate;

    return { baseAmount, rate, rateExchangeCurrency };
  }, [selectedCurrency, enteredAmount]);

  useEffect(() => {
    if (!calculatingAmountInBaseCurrency.rateExchangeCurrency) return;

    setValue("actual_base_amount", Number(calculatingAmountInBaseCurrency.baseAmount.toFixed(4)));

    setValue("fx_rate_to_base", calculatingAmountInBaseCurrency.rate);

    setValue("transaction_currency_id", calculatingAmountInBaseCurrency.rateExchangeCurrency.currency_id);
  }, [calculatingAmountInBaseCurrency, setValue]);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        Amount *
        <div
          className={`flex items-center justify-between gap-1 w-full h-16 p-2 font-semibold border rounded-xl 
                  ${
                    errors.transaction_amount
                      ? "border-destructive focus:border-destructive"
                      : // : "border-transparent focus:border-primary focus:bg-card"
                        "focus:outline-none focus:ring-2 focus:ring-blue-500"
                  }
                  `}
        >
          {/* Icon */}
          <div className="w-10 text-lg flex justify-center text-muted-foreground">
            {currenciesStatus === "error" ? null : (
              <span>{currencies.find((c) => c.currency_id === selectedCurrency)?.currency_symbol || ""}</span>
            )}
          </div>

          {/* Input */}
          <input
            {...register("transaction_amount", { valueAsNumber: true })}
            type="number"
            min="0"
            placeholder="0.00"
            className={`w-full text-3xl h-16 pl-3 font-semibold`}
          />

          {/* Currency */}
          <select
            {...register("transaction_currency_id", { valueAsNumber: true })}
            className={`
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
      {/* {selectedCurrency !== defaultCurrency?.currency_id && ( */}
      <p
        className={`m-2 flex items-center flex-row gap-1 text-sm text-muted-foreground ${selectedCurrency !== defaultCurrency?.currency_id ? "" : "hidden"}`}
      >
        <span>
          {" "}
          ≈ {defaultCurrency?.currency_symbol || defaultCurrency?.currency_code}{" "}
          <input
            className="w-20"
            {...register("actual_base_amount", { valueAsNumber: true })}
            disabled={!isEditing}
            placeholder={calculatingAmountInBaseCurrency.baseAmount.toFixed(2)}
          />{" "}
        </span>
        <span className="text-xs opacity-70">
          ( 1 {fullSelectedCurrency?.currency_symbol || fullSelectedCurrency?.currency_code} ={" "}
          {calculatingAmountInBaseCurrency.rate.toFixed(3)}{" "}
          {defaultCurrency?.currency_symbol || defaultCurrency?.currency_code})
        </span>
        <span className="flex-1 text-end text-xs opacity-70 pr-2">{fullSelectedCurrency?.currency_name}</span>
      </p>
      {/* )} */}
      {/* </div> */}
    </div>
  );
};

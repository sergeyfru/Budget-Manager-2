import { Controller, type Control, type FieldErrors } from "react-hook-form";
import { useTransactionStore } from "../../store/transactionsStore";
import type { CreateTransactionForm } from "@shared/core";

interface TypeComponentProps {
  control: Control<CreateTransactionForm>;
  errors: FieldErrors<CreateTransactionForm>;
}

export const TypeComponent = ({ control, errors }: TypeComponentProps) => {
  const { transactionTypesStatus, transactionTypes } = useTransactionStore();

  return (
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
  );
};

import type { CreateTransactionForm } from "@shared/core";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

interface DateComponentProps {
  errors: FieldErrors<CreateTransactionForm>;
  register: UseFormRegister<CreateTransactionForm>;
}

export const DateComponent = ({ register, errors }: DateComponentProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        Date
        <input
          type="date"
          {...register("date_of_transaction", { valueAsDate: false })}
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
  );
};

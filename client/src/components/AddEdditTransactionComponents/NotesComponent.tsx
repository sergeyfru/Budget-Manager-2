import type { CreateTransactionForm } from "@shared/core";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

interface NotesComponentProps {
  errors: FieldErrors<CreateTransactionForm>;
  register: UseFormRegister<CreateTransactionForm>;
}

export const NotesComponent = ({ register, errors }: NotesComponentProps) => {
  return (
    <div className=" space-y-2">
      <label className="text-sm font-medium">
        Notes (optional)
        <textarea
          {...register("transaction_note")}
          className="w-full min-h-12 px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
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
  );
};

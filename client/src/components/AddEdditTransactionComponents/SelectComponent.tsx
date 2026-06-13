import type { Status } from "@shared/core";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface SelectComponentProps<T> {
  title: string;
  error?: FieldError;
  selectorStatus: Status;
  labelKey: keyof T;
  valueKey: keyof T;
  selectOptions: T[];
  registration: UseFormRegisterReturn;
}
export const SelectComponent = <T,>({
  title,
  error,
  registration,
  selectorStatus,
  labelKey,
  valueKey,
  selectOptions,
}: SelectComponentProps<T>) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        {title}
        <select
          {...registration}
          defaultValue=""
          className={`w-full h-12 px-3 border rounded-xl
                ${
                  error
                    ? "border-destructive focus:border-destructive"
                    : // : "border-transparent focus:border-primary focus:bg-card"
                      "focus:outline-none focus:ring-2 focus:ring-blue-500"
                }
                  `}
        >
          <option value={""} disabled>
            Select Category
          </option>
          {selectorStatus === "loading" ? (
            <option disabled>Loading categories..</option>
          ) : selectorStatus === "error" ? (
            <option disabled>Failed to load categories</option>
          ) : (
            selectOptions.map((item, index) => (
              <option key={index} value={String(item[valueKey])}>
                {String(item[labelKey])}
              </option>
            ))
          )}
        </select>
        {error ? <p className="text-sm text-destructive-foreground">{error.message}</p> : null}
      </label>
    </div>
  );
};

import type { CreateTransactionForm } from "@shared/core";
import type { FieldError, UseFormRegister } from "react-hook-form";
import { useState } from "react";
import { ChevronDown, Plus, Trash2 } from "lucide-react";

interface AdvancedSettingsComponentProps {
  error?: FieldError;
  register?: UseFormRegister<CreateTransactionForm>;
}

export const AdvancedSettingsComponent = ({}: AdvancedSettingsComponentProps) => {
  const stillInDevelopment = import.meta.env.VITE_STILL_IN_DEVELOPMENT === "true";

  if (stillInDevelopment) {
    return null;
  }

  const [additionalSettingsOpen, setAdditionalSettingsOpen] = useState(false);

  // Split payment state
  const [splitPaymentEnabled, setSplitPaymentEnabled] = useState(false);
  const [splitType, setSplitType] = useState<"equal" | "custom" | "downpayment">("equal");
  const [splitRows, setSplitRows] = useState([{ amount: "", date: new Date() }]);

  // Recurring transaction state
  const [recurringEnabled, setRecurringEnabled] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly");
  const [recurringStartDate, setRecurringStartDate] = useState<Date>(new Date());
  const [recurringEndType, setRecurringEndType] = useState<"never" | "date" | "occurrences">("never");
  const [recurringEndDate, setRecurringEndDate] = useState<Date>(new Date());
  const [recurringOccurrences, setRecurringOccurrences] = useState("12");
  const [recurringWeekendAdjust, setRecurringWeekendAdjust] = useState(false);

  // Schedule transaction state
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState<Date>(new Date());
  const [scheduleTime, setScheduleTime] = useState("09:00");

  const toDateInputValue = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  return (
    <details
      open={additionalSettingsOpen}
      onToggle={(e) => setAdditionalSettingsOpen((e.target as HTMLDetailsElement).open)}
      className="space-y-4"
    >
      <summary className="flex items-center justify-between w-full p-4 rounded-xl bg-muted/50 hover:bg-muted cursor-pointer">
        <span className="font-medium">Additional settings</span>
        <ChevronDown className={`w-5 h-5 transition-transform ${additionalSettingsOpen ? "rotate-180" : ""}`} />
      </summary>

      <div className="space-y-6 mt-4">
        {/* Split Payment */}
        <div className="space-y-4 p-4 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium">Split Payment</label>
              <p className="text-sm text-muted-foreground mt-1">Divide this transaction into multiple payments</p>
            </div>

            <input
              type="checkbox"
              checked={splitPaymentEnabled}
              onChange={(e) => setSplitPaymentEnabled(e.target.checked)}
              className="h-5 w-5"
            />
          </div>

          {splitPaymentEnabled && (
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="space-y-2">
                <label className="font-medium">Split Type</label>

                <select
                  value={splitType}
                  onChange={(e) => setSplitType(e.target.value as typeof splitType)}
                  className="w-full h-12 rounded-lg border bg-background px-3"
                >
                  <option value="equal">Equal installments</option>
                  <option value="custom">Custom split</option>
                  <option value="downpayment">Down payment + installments</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="font-medium">Payment Schedule</label>

                {splitRows.map((row, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Amount"
                      value={row.amount}
                      onChange={(e) => {
                        const rows = [...splitRows];
                        rows[index].amount = e.target.value;
                        setSplitRows(rows);
                      }}
                      className="flex-1 h-10 rounded-lg border px-3"
                    />

                    <input
                      type="date"
                      value={toDateInputValue(row.date)}
                      onChange={(e) => {
                        const rows = [...splitRows];
                        rows[index].date = new Date(e.target.value);
                        setSplitRows(rows);
                      }}
                      className="h-10 rounded-lg border px-3"
                    />

                    {splitRows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setSplitRows(splitRows.filter((_, i) => i !== index))}
                        className="h-10 w-10 flex items-center justify-center rounded-lg border"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    setSplitRows([
                      ...splitRows,
                      {
                        amount: "",
                        date: new Date(),
                      },
                    ])
                  }
                  className="w-full h-10 rounded-lg border flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add payment
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Recurring Transaction */}
        <div className="space-y-4 p-4 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium">Recurring Transaction</label>
              <p className="text-sm text-muted-foreground mt-1">Automatically repeat this transaction</p>
            </div>

            <input
              type="checkbox"
              checked={recurringEnabled}
              onChange={(e) => setRecurringEnabled(e.target.checked)}
              className="h-5 w-5"
            />
          </div>

          {recurringEnabled && (
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="space-y-2">
                <label className="font-medium">Frequency</label>

                <select
                  value={recurringFrequency}
                  onChange={(e) => setRecurringFrequency(e.target.value as typeof recurringFrequency)}
                  className="w-full h-12 rounded-lg border px-3"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-medium">Start Date</label>

                <input
                  type="date"
                  value={toDateInputValue(recurringStartDate)}
                  onChange={(e) => setRecurringStartDate(new Date(e.target.value))}
                  className="w-full h-12 rounded-lg border px-3"
                />
              </div>

              <div className="space-y-2">
                <label className="font-medium">End Condition</label>

                <select
                  value={recurringEndType}
                  onChange={(e) => setRecurringEndType(e.target.value as typeof recurringEndType)}
                  className="w-full h-12 rounded-lg border px-3"
                >
                  <option value="never">Never ends</option>
                  <option value="date">End date</option>
                  <option value="occurrences">Number of occurrences</option>
                </select>
              </div>

              {recurringEndType === "date" && (
                <div className="space-y-2">
                  <label className="font-medium">End Date</label>

                  <input
                    type="date"
                    value={toDateInputValue(recurringEndDate)}
                    onChange={(e) => setRecurringEndDate(new Date(e.target.value))}
                    className="w-full h-12 rounded-lg border px-3"
                  />
                </div>
              )}

              {recurringEndType === "occurrences" && (
                <div className="space-y-2">
                  <label className="font-medium">Number of Occurrences</label>

                  <input
                    type="number"
                    min="1"
                    value={recurringOccurrences}
                    onChange={(e) => setRecurringOccurrences(e.target.value)}
                    className="w-full h-12 rounded-lg border px-3"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Auto-adjust if date falls on weekend</label>

                  <p className="text-xs text-muted-foreground mt-1">Move to next business day</p>
                </div>

                <input
                  type="checkbox"
                  checked={recurringWeekendAdjust}
                  onChange={(e) => setRecurringWeekendAdjust(e.target.checked)}
                  className="h-5 w-5"
                />
              </div>
            </div>
          )}
        </div>

        {/* Schedule Transaction */}
        <div className="space-y-4 p-4 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium">Schedule Transaction</label>

              <p className="text-sm text-muted-foreground mt-1">Schedule for a future date and time</p>
            </div>

            <input
              type="checkbox"
              checked={scheduleEnabled}
              onChange={(e) => setScheduleEnabled(e.target.checked)}
              className="h-5 w-5"
            />
          </div>

          {scheduleEnabled && (
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="space-y-2">
                <label className="font-medium">Date</label>

                <input
                  type="date"
                  value={toDateInputValue(scheduleDate)}
                  onChange={(e) => setScheduleDate(new Date(e.target.value))}
                  className="w-full h-12 rounded-lg border px-3"
                />
              </div>

              <div className="space-y-2">
                <label className="font-medium">Time</label>

                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full h-12 rounded-lg border px-3"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </details>
  );
};

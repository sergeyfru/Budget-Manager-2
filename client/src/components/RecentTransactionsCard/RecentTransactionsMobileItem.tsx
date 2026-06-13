import type { TransactionDB, TransactionDetailed } from "@shared/core";
import { useTransactionStore } from "../../store/transactionsStore";
import { CustomIcon } from "../CustomIcons/CustomIcons";
import { EditDelete } from "../EditDelete/EditDelete";
import { useModalsStore } from "../../store/modalsStore";
import { useSettingsStore } from "../../store/settingsStore";

interface RecentTransactionsMobileItemProps {
  transaction: TransactionDetailed;
  showDate?: boolean;
}

export function RecentTransactionsMobileItem({ transaction, showDate = false }: RecentTransactionsMobileItemProps) {
  const { deleteTransaction } = useTransactionStore();
  const { setEditingTransaction, setAddEditTransactionModalOpen } = useModalsStore();
  const category = transaction.user_category; // Assuming category is a property of TransactionDetailed
  const { defaultCurrency } = useSettingsStore();

  const symbol = transaction.currency.currency_symbol || "";
  const currSymbol = defaultCurrency.currency_symbol || "";

  const handleEdit = (transaction: TransactionDetailed) => {
    const {
      transaction_id,
      // user_id,
      transaction_type,
      user_payment_method,
      user_category,
      transaction_amount,
      date_of_transaction,
      transaction_note,
      created_at,
    } = transaction;

    const transactionForEdit = {
      transaction_id,
      // user_id,
      transaction_amount,
      date_of_transaction,
      transaction_note,
      transaction_type_id: transaction_type.id,
      user_category_id: user_category.id,
      user_payment_method_id: user_payment_method.id,
      created_at,
    } as TransactionDB;

    console.log(transactionForEdit);
    console.log(new Date(transactionForEdit.date_of_transaction));

    setEditingTransaction(transactionForEdit);
    setAddEditTransactionModalOpen(true);
  };
  return (
    <div className="flex items-center gap-3 md:gap-4 py-3 md:py-4 group hover:bg-muted/30 -mx-2 px-2 rounded-lg transition-colors">
      <div
        className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: category?.color + "20" }}
      >
        <CustomIcon name={category?.icon || "ImageOff"} color={category?.color || "#666"} size={20} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1 gap-1">
          <h4 className="truncate">{transaction.user_category.name}</h4>
          <p
            className={`flex-shrink-0 font-medium ${
              transaction.transaction_type.direction === "in" ? "text-success-foreground/80" : "text-muted-foreground"
            }`}
          >
            {transaction.transaction_type.direction === "in" ? "+" : ""}
            {transaction.transaction_amount.toFixed(2)} {symbol}
          </p>
          {transaction.transaction_currency_id !== transaction.base_currency_id && (
            <span
              className={`${
                transaction.transaction_type.direction === "in" ? "text-success-foreground" : "text-foreground"
              }`}
            >
              ~ {transaction.actual_base_amount.toFixed(2)} {currSymbol}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground truncate">
            {transaction.transaction_note || transaction.user_payment_method.name}
          </p>
          {showDate && (
            <p className="text-xs text-muted-foreground flex-shrink-0">
              {new Date(transaction.date_of_transaction).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col justify-center items-center">
        <EditDelete
          onEdit={() => {
            handleEdit(transaction);
          }}
          onDelete={() => deleteTransaction(transaction.transaction_id)}
        />
      </div>
    </div>
  );
}

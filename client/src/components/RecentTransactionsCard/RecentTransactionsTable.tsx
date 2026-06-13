import type { TransactionDB, TransactionDetailed, TransactionsDetailedArr } from "@shared/core";
import { EditDelete } from "../EditDelete/EditDelete";
import { CustomIcon } from "../CustomIcons/CustomIcons";
import { useTransactionStore } from "../../store/transactionsStore";
import { useModalsStore } from "../../store/modalsStore";
import { Plus } from "lucide-react";

interface RecentTransactionsTableProps {
  transactions: TransactionsDetailedArr;
  symbol: string | null;
  showMore: boolean;
  toggleShowMore: () => void;
}

export const RecentTransactionsTable = ({
  transactions,
  symbol,
  showMore,
  toggleShowMore,
}: RecentTransactionsTableProps) => {
  const { setEditingTransaction, setAddEditTransactionModalOpen } = useModalsStore();

  const transactionStore = useTransactionStore();
  const onDelete = (transaction_id: number) => {
    transactionStore.deleteTransaction(transaction_id);
  };

  const handleEdit = (transaction: TransactionDetailed) => {
    const {
      transaction_id,
      date_of_transaction,
      transaction_note,

      fx_rate_to_base,

      base_currency_id,
      actual_base_amount,

      transaction_type_id,
      user_category_id,
      user_payment_method_id,

      transaction_amount,
      transaction_currency_id,

      created_at,
    } = transaction;

    const transactionForEdit = {
      transaction_id,

      date_of_transaction,
      transaction_note,

      fx_rate_to_base,

      base_currency_id,
      actual_base_amount,

      transaction_type_id,
      user_category_id,
      user_payment_method_id,

      transaction_amount,
      transaction_currency_id,

      created_at,
    } as TransactionDB;

    setEditingTransaction(transactionForEdit);
    setAddEditTransactionModalOpen(true);
  };
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-border">
          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
          <th className="py-3 px-4 text-sm font-medium text-muted-foreground text-center">Description</th>
          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground text-center">Date</th>
          <th className="py-3 px-4 text-sm font-medium text-muted-foreground text-center">Payment</th>
          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground text-center">Amount</th>
          <th className="py-3 px-4 text-sm font-medium text-muted-foreground text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        {transactions.length > 0 ? (
          transactions.map((transaction) => {
            return (
              <tr
                key={transaction.transaction_id}
                className="border-b border-border group hover:bg-muted/30 transition-colors"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex md:hidden lg:flex w-10 h-10 rounded-lg items-center justify-center flex-shrink-0 text-sm"
                      style={{ backgroundColor: transaction.user_category?.color + "20" }}
                    >
                      <CustomIcon
                        name={transaction.user_category?.icon || "DollarSign"}
                        color={transaction.user_category?.color || "#666"}
                        size={18}
                      />
                    </div>
                    <span className="font-medium">{transaction.user_category?.name}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-center gap-2">
                    <span className={transaction.transaction_note ? "text-foreground" : "text-muted-foreground/50"}>
                      {transaction.transaction_note || "No description"}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm">
                    {new Date(transaction.date_of_transaction).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2 justify-center relative group/payment">
                    <CustomIcon
                      name={transaction.user_payment_method.icon || "CreditCard"}
                      color={transaction.user_payment_method.color || "#666"}
                      size={18}
                    />
                    <div className="absolute bottom-full mb-1 hidden group-hover/payment:block bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {transaction.user_payment_method.name}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex flex-col items-end justify-end gap-2">
                    <span
                      className={`font-medium ${
                        transaction.transaction_type.direction === "in" ? "text-success-foreground" : "text-foreground"
                      }`}
                    >
                      {transaction.transaction_type.direction === "in" ? "+" : ""}
                      {transaction.transaction_amount}
                      <span
                        className={`font-medium ${
                          transaction.transaction_type.direction === "in"
                            ? "text-success-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {transaction.currency.currency_symbol}
                      </span>
                    </span>
                    {transaction.transaction_currency_id !== transaction.base_currency_id && (
                      <span
                        className={`${
                          transaction.transaction_type.direction === "in"
                            ? "text-success-foreground/80"
                            : "text-muted-foreground"
                        }`}
                      >
                        ~ {transaction.actual_base_amount.toFixed(2)} {symbol}
                      </span>
                    )}
                  </div>
                </td>
                <td className="flex justify-center gap-0.5 opacity-40 group-hover:opacity-100 transition-opacity flex-col justify-center items-center">
                  <EditDelete
                    onEdit={() => {
                      handleEdit(transaction);
                    }}
                    onDelete={() => onDelete(transaction.transaction_id)}
                  />
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={6} className="text-center">
              <div className="text-center flex flex-col items-center gap-1 py-6">
                <p className="text-muted-foreground">No transactions yet</p>
                <p className="text-sm text-muted-foreground mt-2">Add your first transaction to get started</p>
                <button
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0"
                  onClick={() => setAddEditTransactionModalOpen(true)}
                >
                  <Plus />
                </button>
              </div>
            </td>
          </tr>
        )}
        {showMore ? (
          <tr>
            <td colSpan={6} className="py-2 text-center">
              <button
                onClick={toggleShowMore}
                className="bg-primary text-primary-foreground hover:bg-primary/80 py-2 px-4 rounded-md"
              >
                See more
              </button>
            </td>
          </tr>
        ) : (
          <tr>
            <td colSpan={6} className="py-2 text-center">
              <p className="text-sm text-muted-foreground mt-2">No more transactions to show</p>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

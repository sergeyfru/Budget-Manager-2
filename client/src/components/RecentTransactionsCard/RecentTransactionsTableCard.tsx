import type { TransactionsDetailedArr } from "@shared/core";
import { EditDelete } from "../EditDelete/EditDelete";
import { CustomIcon } from "../CustomIcons/CustomIcons";

interface RecentTransactionsTableCardProps {
  transactions: TransactionsDetailedArr;
  symbol: string | null;
  showMore: boolean;
  howManyToShow: number;
  toggleShowMore: () => void;
}

export const RecentTransactionsTableCard = ({
  transactions,
  symbol,
  showMore,
  howManyToShow,
  toggleShowMore,
}: RecentTransactionsTableCardProps) => {
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
          {/* <th className="w-12">Actions</th> */}
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
                    <span className="text-muted-foreground">{transaction.transaction_note || "No description"}</span>
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
                  <div className="flex items-center justify-end gap-2">
                    {/* <div
                                    className={`hidden lg:flex w-6 h-6 rounded-md items-center justify-center ${
                                      transaction.transaction_type.direction === "in"
                                        ? "bg-green-500/10"
                                        : "bg-red-500/10"
                                    }`}
                                  >
                                    {transaction.transaction_type.direction === "in" ? (
                                      <ArrowDownLeft className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                                    ) : (
                                      <ArrowUpRight className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                                    )}
                                  </div> */}

                    <span
                      className={`font-medium ${
                        transaction.transaction_type.direction === "in"
                          ? "text-green-600 dark:text-green-400"
                          : "text-foreground"
                      }`}
                    >
                      {transaction.transaction_type.direction === "in" ? "+" : ""}
                      {transaction.transaction_amount}
                    </span>
                    <span
                      className={`font-medium ${
                        transaction.transaction_type.direction === "in"
                          ? "text-green-600 dark:text-green-400"
                          : "text-foreground"
                      }`}
                    >
                      {symbol}
                    </span>
                  </div>
                </td>
                <td className="flex justify-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity flex-col justify-center items-center">
                  <EditDelete onEdit={() => {}} onDelete={() => {}} />
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={6} className="py-12 text-center">
              <p className="text-muted-foreground">No transactions yet</p>
              <p className="text-sm text-muted-foreground mt-2">Add your first transaction to get started</p>
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

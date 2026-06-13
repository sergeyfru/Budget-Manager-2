import type { TransactionsDetailedArr } from "@shared/core";
import { RecentTransactionsTable } from "./RecentTransactionsTable";
import { RecentTransactionsMobileItem } from "./RecentTransactionsMobileItem";
import { useState } from "react";
import { useTransactionStore } from "../../store/transactionsStore";
import { useSettingsStore } from "../../store/settingsStore";
import { Plus, RefreshCw } from "lucide-react";
import { useMediaQuery } from "react-responsive";
import { breakpoints } from "../../constants/constants";

interface RecentTransactionsCardProps {
  transactions: TransactionsDetailedArr;
  symbol: string | null;
}

export const RecentTransactionsCard = ({ transactions, symbol }: RecentTransactionsCardProps) => {
  const isNotMobile = useMediaQuery({ minWidth: breakpoints.md });
  const { setAddTransactionModalOpen } = useSettingsStore();

  const transactionStore = useTransactionStore();
  const [howManyToShow, setHowManyToShow] = useState(5);
  const transactionsToShow = transactions
    .sort((a, b) => new Date(b.date_of_transaction).getTime() - new Date(a.date_of_transaction).getTime())
    .slice(0, howManyToShow);

  const toggleShowMore = () => {
    setHowManyToShow(howManyToShow + 5);
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-5 lg:p-6 border-b border-border">
        <h2>Recent Transactions</h2>
        <button onClick={() => transactionStore.getTransactions()}>
          <RefreshCw />
        </button>
      </div>

      {!isNotMobile && (
        <div className="divide-y divide-border p-5">
          {transactionsToShow.length > 0 ? (
            transactionsToShow.map((transaction) => (
              <RecentTransactionsMobileItem key={transaction.transaction_id} transaction={transaction} showDate />
            ))
          ) : (
            <div className="text-center flex flex-col items-center gap-1 py-6">
              <p className="text-muted-foreground">No transactions yet</p>
              <p className="text-sm text-muted-foreground mt-2">Add your first transaction to get started</p>
              <button
                className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0"
                onClick={() => setAddTransactionModalOpen(true)}
              >
                <Plus />
              </button>
            </div>
          )}
          {transactions.length > howManyToShow ? (
            <button onClick={() => toggleShowMore()} className="text-sm text-primary hover:underline transition-all">
              Show More
            </button>
          ) : (
            <p className="text-sm text-muted-foreground mt-2 text-center">No more transactions to show</p>
          )}
        </div>
      )}

      {/* Desktop: Table View */}
      {isNotMobile && (
        <div className="overflow-x-auto">
          <RecentTransactionsTable
            transactions={transactionsToShow}
            showMore={transactions.length > howManyToShow}
            toggleShowMore={() => toggleShowMore()}
            symbol={symbol}
          />
        </div>
      )}
    </div>
  );
};

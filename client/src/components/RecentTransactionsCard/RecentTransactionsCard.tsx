import type { TransactionsDetailedArr } from "@shared/core";
import { EditDelete } from "../EditDelete/EditDelete";
import { CustomIcon } from "../CustomIcons/CustomIcons";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { TransactionItem } from "../TransactionItem/TransactionItem";
import { RecentTransactionsTableCard } from "./RecentTransactionsTableCard";
import { useState } from "react";
import { set } from "zod";

interface RecentTransactionsCardProps {
  transactions: TransactionsDetailedArr;
  symbol: string | null;
  recentTransactions: TransactionsDetailedArr;
}


export const RecentTransactionsCard= ({ transactions, symbol, recentTransactions }: RecentTransactionsCardProps) => {
    const [howManyToShow, setHowManyToShow] = useState(5);
    const transactionsToShow = transactions.slice(0, howManyToShow);

    const toggleShowMore = () => {
        console.log("Show more clicked, now showing", howManyToShow + 5, "transactions");
        setHowManyToShow(howManyToShow + 5);

    };

    return (
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-5 lg:p-6 border-b border-border">
                <h3>Recent Transactions</h3>
              </div>

              {/* Mobile: List View */}
              <div className="md:hidden divide-y divide-border p-5">
                {transactionsToShow.length > 0 ? (
                  transactionsToShow.map((transaction) => (
                    <TransactionItem key={transaction.transaction_id} transaction={transaction} showDate />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No transactions yet</p>
                    <p className="text-sm text-muted-foreground mt-2">Add your first transaction to get started</p>
                  </div>
                )}
                {transactions.length > howManyToShow ? (
                  <button onClick={() => toggleShowMore()} className="text-sm text-primary hover:underline transition-all">
                    Show More
                  </button>
                ): (
                    <p className="text-sm text-muted-foreground mt-2 text-center">No more transactions to show</p>
                )}
              </div>

              {/* Desktop: Table View */}
              <div className="hidden md:block">
                {/* <TransactionTable transactions={recentTransactions} /> */}
                <div className="overflow-x-auto">
                  <RecentTransactionsTableCard transactions={transactionsToShow} showMore={transactions.length > howManyToShow} howManyToShow={howManyToShow} toggleShowMore={() => toggleShowMore()} symbol={symbol} />
                </div>
              </div>
            </div>
    )
}
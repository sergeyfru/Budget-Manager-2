import { useTransactionStore } from "../../store/transactionsStore";

export const RecentTransactions = () => {
  const transactionStore = useTransactionStore();
  const transactions = transactionStore.transactions;
  return (
    <div className="bg-card rounded-2xl p-5 sm:p-6 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-5">
        {transactions.length > 0 ? (
          <ul className="divide-y divide-border">
            {transactions.map((transaction) => (
              <li key={transaction.transaction_id}>
                <h1>{transaction.transaction_note}</h1>
                <p>
                  {transaction.transaction_amount}{" "}
                  {transaction.currency.currency_symbol}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No transactions yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Add your first transaction to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

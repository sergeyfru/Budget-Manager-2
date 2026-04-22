
import { Greeting } from "../../components/Greeting/Greeting";
import { TotalBalanceCard } from "../../components/TotalBalanceCard/TotalBalanceCard";
import { SpendingChart } from "../../components/MonthlySpending/MonthlySpending";
import { useEffect } from "react";
import { useTransactionStore } from "../../store/transactionsStore";
import { Loader } from "../../components/Loading/Loader";
import { RecentTransactionsCard } from "../../components/RecentTransactionsCard/RecentTransactionsCard";

export const DashBoardPage = () => {
  const transactionStore = useTransactionStore();
  const transactions = transactionStore.transactions;

  useEffect(() => {
    document.title = "Budget Manager - Home";
    if (transactionStore.transactions.length === 0) {
      transactionStore.getTransactions();
    }
  }, []);

  const totalBalance = transactionStore.transactions.reduce(
    (acc, transaction) => acc + transaction.transaction_amount,
    0,
  );
  const symbol =
    transactionStore.transactions.length > 0 ? transactionStore.transactions[0].currency.currency_symbol : "₪";

  const monthlyExpenseTransactions = transactionStore.transactions
    .filter((transaction) => transaction.transaction_type.direction === "out")
    .filter((transaction) => {
      const transactionDate = new Date(transaction.date_of_transaction);
      const currentDate = new Date();
      return (
        transactionDate.getMonth() === currentDate.getMonth() &&
        transactionDate.getFullYear() === currentDate.getFullYear()
      );
    });
  const monthlyExpenses = monthlyExpenseTransactions.reduce(
    (acc, transaction) => acc + transaction.transaction_amount,
    0,
  );

  const monthlyIncomeTransactions = transactionStore.transactions
    .filter((transaction) => transaction.transaction_type.direction === "in")
    .filter((transaction) => {
      const transactionDate = new Date(transaction.date_of_transaction);
      const currentDate = new Date();
      return (
        transactionDate.getMonth() === currentDate.getMonth() &&
        transactionDate.getFullYear() === currentDate.getFullYear()
      );
    });
  const monthlyIncome = monthlyIncomeTransactions.reduce((acc, transaction) => acc + transaction.transaction_amount, 0);

  const recentTransactions = transactionStore.transactions
    .slice()
    .sort((a, b) => new Date(b.date_of_transaction).getTime() - new Date(a.date_of_transaction).getTime())
    .slice(0, 5);

  const spendingsGrupedByCategory = monthlyExpenseTransactions.reduce(
    (acc, t) => {
      const key = t.user_category.name; // Group by user category name
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(t);
      return acc;
    },
    {} as Record<string, typeof monthlyExpenseTransactions>,
  );
  console.log("spendingsGrupedByCategory", spendingsGrupedByCategory);
  const spendingsSumByCategory = Object.entries(spendingsGrupedByCategory)
    .map(([category, transactions]) => {
      const totalAmount = transactions.reduce((sum, t) => sum + t.transaction_amount, 0);
      return {
        category,
        // transaction: transactions[0],
        // user_category: transactions[0].user_category,
        user_category_color: transactions[0].user_category.color,
        currency: transactions[0].currency.currency_symbol,
        totalAmount,
      };
    })
    .sort((a, b) => b.totalAmount - a.totalAmount);
  return (
    <div className="min-h-screen">
      {/* Header */}

      <Greeting title="Welcome back!" subtitle="Here's your financial overview" />

      <Loader loading={transactionStore.transactionsStatus === "loading"} center={true} size={48}>
        <div className="px-4 sm:px-6 lg:px-8 xl:px-12 py-6 lg:py-8 pb-24 lg:pb-8">
          {/* Balance Card */}
          <Loader loading={transactionStore.transactionsStatus === "loading"} overlay={true} center={true} size={48}>
            <div className="mb-6 lg:mb-8">
              <TotalBalanceCard
                currencySimbol={symbol}
                totalBalance={totalBalance}
                monthlyIncome={monthlyIncome}
                monthlyExpenses={monthlyExpenses}
              />
            </div>
          </Loader>
          {/* Main Content Grid - Desktop: 2 columns, Mobile: 1 column */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Column - Transactions (2/3 width on desktop) */}

            <div className="xl:col-span-2">
              <Loader loading={transactionStore.transactionsStatus === "loading"} overlay={true} size={48}>
                <RecentTransactionsCard
                  recentTransactions={recentTransactions}
                  symbol={symbol}
                  transactions={transactions}
                />
              </Loader>
            </div>

            {/* Right Column - Spending Chart (1/3 width on desktop) */}
            <div className="xl:col-span-1">
              <Loader loading={transactionStore.transactionsStatus === "loading"} overlay={true} size={48}>
                <div className="bg-card rounded-2xl p-5 lg:p-6 shadow-sm border border-border xl:sticky xl:top-34">
                  <h3 className="mb-6">Monthly Spending</h3>

                  {/* {Object.keys(spendingsGrupedByCategory).length > 0 ? ( */}
                  {spendingsSumByCategory.length > 0 ? (
                    <SpendingChart spendingsSumByCategory={spendingsSumByCategory} currency={symbol} />
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No expenses this month</p>
                      <p className="text-sm text-muted-foreground mt-2">Start tracking your spending</p>
                    </div>
                  )}
                </div>
              </Loader>
            </div>
          </div>
        </div>
      </Loader>
    </div>
  );
};

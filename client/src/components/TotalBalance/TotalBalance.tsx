import { useTransactionStore } from "../../store/transactionsStore";

export const TotalBalance = () => {
  const { status } = useTransactionStore();
  const transactionStore = useTransactionStore();
  const mainCurrency = transactionStore.transactions.length > 0 ? transactionStore.transactions[0].currency.currency_symbol : null;
  const totalBalance = transactionStore.transactions.reduce((acc, transaction) => {
    return transaction.transaction_type.direction === "in" ? acc + transaction.transaction_amount : acc - transaction.transaction_amount;
  }, 0);
  const monthlySpending = transactionStore.transactions
    .filter(transaction => transaction.transaction_type.direction === "out")
    .filter(transaction => {
      const transactionDate = new Date(transaction.date_of_transaction);
      const currentDate = new Date();
      return transactionDate.getMonth() === currentDate.getMonth() && transactionDate.getFullYear() === currentDate.getFullYear();
    } )
    .reduce((acc, transaction) => acc + transaction.transaction_amount, 0);
      const monthlyIncome = transactionStore.transactions
        .filter(transaction => transaction.transaction_type.direction === "in")
        .filter(transaction => {
          const transactionDate = new Date(transaction.date_of_transaction);
          const currentDate = new Date();
          return transactionDate.getMonth() === currentDate.getMonth() && transactionDate.getFullYear() === currentDate.getFullYear();
        })
        .reduce((acc, transaction) => acc + transaction.transaction_amount, 0);
if (status === "loading") return <Spinner />;
if (status === "error") return <Error />;
  return (

    <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "8px" }}>
      <h2>Total Balance: {totalBalance} {mainCurrency}</h2>
      <div>
        <h3>Monthly Spending: <span style={{ color: "#F44336", fontWeight: "bold" }}>{monthlySpending} {mainCurrency}</span></h3>
        <h3>Monthly Income: <span style={{ color: "#4CAF50", fontWeight: "bold" }}>{monthlyIncome} {mainCurrency}</span></h3>
      </div>
    </div>
  );
};

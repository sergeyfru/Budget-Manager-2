
// import { useAuthStore } from "../../store/useAuthStore";
import { useTransactionStore } from "../../store/transactionsStore";

export const Greeting = () => {
  // const authStore = useAuthStore();
  const transactionStore = useTransactionStore();

  const handleFetchTransactions = async () => {
    console.log('in handleFetchTransactions');
    
    try {
      const transactions = await transactionStore.getTransactions();
      console.log("Fetched transactions:", transactions);
    } catch (err) {
      console.error("Error fetching transactions in Greeting component:", err);
    }
  };
  return (
       <div className="mb-6 md:mb-8">
        <h1 className="mb-2">Welcome back!</h1>
        <p className="text-muted-foreground">Here's your financial overview</p>
        <button onClick={handleFetchTransactions}>Fetch Transactions</button>
      </div>
  );
};

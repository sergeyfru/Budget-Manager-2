import { toast } from "sonner";
import { Greeting } from "../../components/Greeting/Greeting";
import { TotalBalance } from "../../components/TotalBalance/TotalBalance";
import {MonthlySpending} from "../../components/MonthlySpending/MonthlySpending";
import {RecentTransactions} from "../../components/RecentTransactions/RecentTransactions";
import { useEffect } from "react";
import { useTransactionStore } from "../../store/transactionsStore";

export const DashBoardPage = () => {
  const transactionStore = useTransactionStore();
  

useEffect(() => {

    document.title = "Budget Manager - Home";
  if (transactionStore.transactions.length === 0) { 
    transactionStore.getTransactions();
  }
}, []);


  return (
    <div className="pb-20 sm:pb-24 px-4 sm:px-6 md:px-8 pt-6 md:pt-8 max-w-7xl mx-auto">
      <Greeting />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
      <TotalBalance />
      <RecentTransactions />
      </div>
      </div>

      <MonthlySpending />
    </div>
  );
};

import { ArrowDownLeft, ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react";
interface TotalBalanceProps {
  currencySimbol: string | null;
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}

export const TotalBalanceCard = ({
  currencySimbol,
  totalBalance,
  monthlyIncome,
  monthlyExpenses,
}: TotalBalanceProps) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 md:p-8 shadow-sm">
      <div className="flex items-start justify-between mb-6 md:mb-8">
        <div className="flex-1">
          <h2 className="mb-2">Total Balance</h2>
          <h3 className={`text-3xl sm:text-4xl md:text-5xl tracking-tight
            ${totalBalance > 0 ?"text-success": totalBalance < 0 ? "text-destructive" : ""}`}>
            {totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" "}
            {currencySimbol}
          </h3>
        </div>
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          {totalBalance >= 0 ? (
            <TrendingUp className="w-6 h-6 md:w-7 md:h-7 text-primary" />
          ) : (
            <TrendingDown className="w-6 h-6 md:w-7 md:h-7 text-primary" />
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-success/20 backdrop-blur-sm rounded-xl p-4 md:p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-success/30 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4 text-success-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">Income</span>
          </div>
          <p className="text-lg md:text-xl text-success-foreground">
            {currencySimbol}{" "}
            {monthlyIncome.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-destructive/20 backdrop-blur-sm rounded-xl p-4 md:p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-destructive/30 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-destructive-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">Expenses</span>
          </div>
          <p className="text-lg md:text-xl text-destructive-foreground">
            {currencySimbol}{" "}
            {monthlyExpenses.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </div>
  );
};

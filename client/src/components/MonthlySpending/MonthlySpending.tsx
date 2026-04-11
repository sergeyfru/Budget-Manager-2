import { ChartPie } from "lucide-react";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Label,
  Legend,
  Tooltip,
  Cell,
} from "recharts";
import { useTransactionStore } from "../../store/transactionsStore";
import { CustomIcon } from "../CustomIcons/CustomIcons";

export const MonthlySpending = () => {
  const transactionStore = useTransactionStore();
  const monthlySpendingTransactions = transactionStore.transactions
    .filter((transaction) => transaction.transaction_type.direction === "out")
    .filter((transaction) => {
      const transactionDate = new Date(transaction.date_of_transaction);
      const currentDate = new Date();
      return (
        transactionDate.getMonth() === currentDate.getMonth() &&
        transactionDate.getFullYear() === currentDate.getFullYear()
      );
    });
  const spendingsGrupedByCategory = monthlySpendingTransactions.reduce(
    (acc, t) => {
      const key = t.user_category.name; // Group by user category name
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(t);
      return acc;
    },
    {} as Record<string, typeof monthlySpendingTransactions>,
  );
  const spendingsSumByCategory = Object.entries(spendingsGrupedByCategory)
    .map(([category, transactions]) => {
      const totalAmount = transactions.reduce(
        (sum, t) => sum + t.transaction_amount,
        0,
      );
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
    <div className="lg:col-span-1">
          <div className="bg-card rounded-2xl p-5 sm:p-6 shadow-sm border border-border sticky top-6">
            <h3 className="mb-5">Monthly Spending</h3>
        {spendingsSumByCategory.length > 0 ? (
          <>
            <div className="mb-6">
              <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={spendingsSumByCategory}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="totalAmount"
                      >
                        {spendingsSumByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.user_category_color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
              {/* <ResponsiveContainer width="100%" height={200}>
                <PieChart
                  accessibilityLayer
                  barCategoryGap="10%"
                  barGap={4}
                  cx="50%"
                  cy="50%"
                  endAngle={360}
                  height={300}
                  innerRadius={0}
                  layout="centric"
                  margin={{
                    bottom: 5,
                    left: 5,
                    right: 5,
                    top: 5,
                  }}
                  outerRadius="80%"
                  stackOffset="none"
                  startAngle={0}
                  syncMethod="index"
                  throttleDelay="raf"
                  throttledEvents={[
                    "mousemove",
                    "touchmove",
                    "pointermove",
                    "scroll",
                    "wheel",
                  ]}
                  width={500}
                >
                  <Pie
                    cornerRadius={8}
                    data={spendingsSumByCategory.map((t) => {
                      return {
                        amt: t.totalAmount,
                        fill: t.user_category_color,
                        name: t.category,
                        currency_symbol: t.currency,
                      };
                    })}
                    // label={(props) => {
                    //   const { index, name, value, percent } = props;

                    //   if (index > 4) return null;

                    //   return `${name}: ${value} (${(percent * 100).toFixed(2)}%)`;
                    // }}
                    // labelLine={false}
                    minAngle={5}
                    paddingAngle={3}
                    dataKey="amt"
                    innerRadius={80}
                    nameKey="name"
                    outerRadius={100}
                  >
                    <Label
                      value={`Total: $${spendingsSumByCategory.reduce(
                        (sum, t) => sum + t.totalAmount,
                        0,
                      )}`}
                      position="center"
                    />
                  </Pie>

                  <Tooltip
                    formatter={(value) => [`$${value}`, "Amount"]}
                    labelFormatter={(label) => `Category: ${label}`}
                  />
                  {/* <Legend
                align="right"
                verticalAlign="middle"
                layout="vertical"
                formatter={(value, entry) => {
                  return `${value} (${entry.payload.amt} ${entry.payload.currency_symbol})`;
                }}
              /> 
                </PieChart>
              </ResponsiveContainer> */}
            </div>
            <div className="space-y-4">
              {spendingsSumByCategory.slice(0, 5).map((item) => (
                <div
                  key={item.category}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.user_category_color }}
                    />
                      <span className="text-sm truncate">{item.category}</span>
                    {/* </div> */}
                    <div className="text-right ml-4">
                      <p className="text-sm">${item.totalAmount.toFixed(2)}</p>
                      {/* <p className="text-xs text-muted-foreground">
                           {((item.totalAmount / totalExpenses) * 100).toFixed(1)}%
                        </p> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ): (
           <div className="text-center py-12">
                <p className="text-muted-foreground">No expenses this month</p>
                <p className="text-sm text-muted-foreground mt-2">Start tracking your spending</p>
              </div>
        )}
      </div>
    </div>
  );
};

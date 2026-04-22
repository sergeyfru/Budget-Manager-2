import { Label, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";


interface MonthlySpendingProps {
  spendingsSumByCategory: {
    category: string;
    totalAmount: number;
    user_category_color: string;
    currency: string | null;
  }[];
  currency: string | null;
}

export const SpendingChart = ({ spendingsSumByCategory, currency }: MonthlySpendingProps) => {

  const totalSpending = spendingsSumByCategory.reduce((acc, t) => acc + t.totalAmount, 0);

  return (
    <>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart
        // barCategoryGap="10%"
        // barGap={4}
        // layout="centric"
        // syncMethod="index"
        // throttleDelay="raf"
        // throttledEvents={["mousemove", "touchmove", "pointermove", "scroll", "wheel"]}
        // height={300}
        // width={500}
        
          accessibilityLayer
          cx="50%"
          cy="50%"
          endAngle={360}
          innerRadius={0}
          margin={{
            bottom: 5,
            left: 5,
            right: 5,
            top: 5,
          }}
          outerRadius="80%"
          stackOffset="none"
          startAngle={0}
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
            minAngle={5}
            paddingAngle={3}
            dataKey="amt"
            innerRadius={80}
            nameKey="name"
            outerRadius={100}
          >
            <Label
              value={`Total: ${totalSpending} ${currency}`}
              position="center"
            />
          </Pie>

          <Tooltip formatter={(value, name ) => [`${value} ${currency}`, name]} labelFormatter={(label) => `Category: ${label}`} />
          {/* <Tooltip
              formatter={(value: number, _name, props) => {
                const currency = props.payload.currency_symbol || "$";
                return [`${currency}${value}`, "Amount"];
              }}
            /> */}
        </PieChart>
      </ResponsiveContainer>

      {spendingsSumByCategory.slice(0, 5).map((t) => (
        <div key={t.category} className="flex items-center justify-between gap-2 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.user_category_color }} />
            <span className="text-sm">{t.category}</span>
          </div>
          <span className="text-sm font-medium">
            {t.currency} {t.totalAmount}
          </span>
        </div>
      ))}
    </>
  );
};

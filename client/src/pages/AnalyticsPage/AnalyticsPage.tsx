
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export const AnalyticsPage = () => {
 

  const symbol =  '$';

  return (
    <div className="min-h-screen pb-20 lg:pb-8">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8 xl:px-12 py-6 lg:py-8">
          <h1 className="mb-2">Analytics</h1>
          <p className="text-muted-foreground">Financial insights and trends</p>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 xl:px-12 py-6 lg:py-8">
        {/* Time Range Filter */}
        <div className="flex gap-2 p-1 bg-muted rounded-xl mb-6 lg:mb-8 max-w-md">
          <button
            className={`flex-1 py-3 rounded-lg transition-all font-medium bg-card shadow-sm`}
          >
            3 Months
          </button>
          <button
            
            className={`flex-1 py-3 rounded-lg transition-all font-medium text-muted-foreground`}
          >
            6 Months
          </button>
          <button
            className={`flex-1 py-3 rounded-lg transition-all font-medium text-muted-foreground`}
          >
            12 Months
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <div className="bg-card rounded-xl p-5 lg:p-6 border border-border shadow-sm">
            <p className="text-sm text-muted-foreground mb-2">Total Income</p>
            <p className="text-2xl lg:text-3xl text-green-600 dark:text-green-400 font-medium">
              {symbol}
            </p>
          </div>
          <div className="bg-card rounded-xl p-5 lg:p-6 border border-border shadow-sm">
            <p className="text-sm text-muted-foreground mb-2">Total Expenses</p>
            <p className="text-2xl lg:text-3xl text-red-600 dark:text-red-400 font-medium">
              {symbol}
            </p>
          </div>
          <div className="bg-card rounded-xl p-5 lg:p-6 border border-border shadow-sm">
            <p className="text-sm text-muted-foreground mb-2">Net Balance</p>
            <p className={`text-2xl lg:text-3xl font-medium text-green-600 dark:text-green-400`}>
              {symbol}
            </p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 mb-6 lg:mb-8">
          {/* Income vs Expenses Chart */}
          <div className="bg-card rounded-2xl p-5 lg:p-8 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3>Income vs Expenses</h3>
                <div className="text-sm text-muted-foreground">
                 monthlyData[activeBarIndex].fullMonth
                </div>
              
            </div>
            <ResponsiveContainer width="100%" height={340}>
              <BarChart 
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="month" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <Tooltip 
                  cursor={{ fill: 'var(--color-muted)', opacity: 0.3 }}
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '12px',
                    padding: '12px',
                  }}
                  // formatter={(value: number) => `${symbol}${value.toFixed(0)}`}
                />
                <Bar 
                  dataKey="income" 
                  fill="#10b981" 
                  radius={[8, 8, 0, 0]}
                  // onMouseEnter={(_, index) => setActiveBarIndex(index)}
                />
                <Bar 
                  dataKey="expenses" 
                  fill="#ef4444" 
                  radius={[8, 8, 0, 0]}
                  // onMouseEnter={(_, index) => setActiveBarIndex(index)}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Net Balance Trend */}
          <div className="bg-card rounded-2xl p-5 lg:p-8 border border-border shadow-sm">
            <h3 className="mb-6">Net Balance Trend</h3>
            <ResponsiveContainer width="100%" height={340}>
              <LineChart>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="month" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '12px',
                    padding: '12px',
                  }}
                  // formatter={(value: number) => `${symbol}${value.toFixed(0)}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="net" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 5 }}
                  activeDot={{ r: 7, strokeWidth: 2, stroke: 'var(--color-card)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        {/* <div className="bg-card rounded-2xl p-5 lg:p-8 border border-border shadow-sm">
          <h3 className="mb-6">Top Spending Categories</h3>
          {categoryData.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {categoryData.slice(0, 8).map((item, index) => {
                const percentage = (item.value / totalExpenses) * 100;
                const isActive = activeCategoryIndex === index;
                
                return (
                  <button
                    key={item.name}
                    onClick={() => setActiveCategoryIndex(isActive ? null : index)}
                    onMouseEnter={() => setActiveCategoryIndex(index)}
                    onMouseLeave={() => setActiveCategoryIndex(null)}
                    className={`text-left transition-all rounded-xl p-4 ${
                      isActive ? 'bg-muted scale-[1.02] shadow-sm' : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: item.color + '20' }}
                      >
                        <CategoryIcon name={item.icon} color={item.color} size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {symbol}{item.value.toFixed(0)} • {percentage.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No expense data available</p>
              <p className="text-sm text-muted-foreground mt-2">Add some transactions to see analytics</p>
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
}

// import { useState } from 'react';
// import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from 'recharts';
// import { useTransactionStore } from '../../store/transactionsStore';


// interface SpendingChartProps {
//   data: Array<{ name: string; value: number; color: string }>;
//   totalExpenses: number;
// }

// const renderActiveShape = (props: any) => {
//   const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

//   return (
//     <g>
//       <Sector
//         cx={cx}
//         cy={cy}
//         innerRadius={innerRadius}
//         outerRadius={outerRadius + 8}
//         startAngle={startAngle}
//         endAngle={endAngle}
//         fill={fill}
//       />
//       <Sector
//         cx={cx}
//         cy={cy}
//         innerRadius={innerRadius - 4}
//         outerRadius={innerRadius}
//         startAngle={startAngle}
//         endAngle={endAngle}
//         fill={fill}
//       />
//     </g>
//   );
// };

// export function SpendingChart({ data, totalExpenses }: SpendingChartProps) {
//   const [activeIndex, setActiveIndex] = useState<number | null>(null);
//   const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
//   const {transactions,  } = useTransactionStore();
  

//   const symbol = settings.currencySymbol || '₪';

//   const onPieClick = (_: any, index: number) => {
//     setActiveIndex(activeIndex === index ? null : index);
//   };

//   const onPieEnter = (_: any, index: number) => {
//     setHoveredIndex(index);
//   };

//   const onPieLeave = () => {
//     setHoveredIndex(null);
//   };

//   const displayIndex = activeIndex !== null ? activeIndex : hoveredIndex;
//   const selectedData = displayIndex !== null ? data[displayIndex] : null;
//   const selectedCategory = selectedData ? categories.find(c => c.name === selectedData.name) : null;

//   return (
//     <div className="relative">
//       {/* Chart */}
//       <div className="relative">
//         <ResponsiveContainer width="100%" height={240}>
//           <PieChart>
//             <Pie
//               activeIndex={displayIndex !== null ? displayIndex : undefined}
//               activeShape={renderActiveShape}
//               data={data}
//               cx="50%"
//               cy="50%"
//               innerRadius={70}
//               outerRadius={100}
//               paddingAngle={2}
//               dataKey="value"
//               onClick={onPieClick}
//               onMouseEnter={onPieEnter}
//               onMouseLeave={onPieLeave}
//               className="cursor-pointer focus:outline-none"
//             >
//               {data.map((entry, index) => (
//                 <Cell 
//                   key={`cell-${index}`} 
//                   fill={entry.color}
//                   opacity={displayIndex !== null && displayIndex !== index ? 0.3 : 1}
//                   className="transition-opacity duration-200"
//                 />
//               ))}
//             </Pie>
//           </PieChart>
//         </ResponsiveContainer>

//         {/* Center Info */}
//         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//           <div className="text-center">
//             {selectedData ? (
//               <>
//                 <div className="mb-2 flex justify-center">
//                   <div
//                     className="w-12 h-12 rounded-xl flex items-center justify-center"
//                     style={{ backgroundColor: selectedCategory?.color + '20' }}
//                   >
//                     <CategoryIcon 
//                       name={selectedCategory?.icon || 'DollarSign'} 
//                       color={selectedCategory?.color || '#666'} 
//                       size={20} 
//                     />
//                   </div>
//                 </div>
//                 <p className="text-sm text-muted-foreground mb-1">{selectedData.name}</p>
//                 <p className="text-2xl font-medium">
//                   {symbol}{selectedData.value.toFixed(0)}
//                 </p>
//                 <p className="text-xs text-muted-foreground mt-1">
//                   {((selectedData.value / totalExpenses) * 100).toFixed(1)}% of total
//                 </p>
//               </>
//             ) : (
//               <>
//                 <p className="text-sm text-muted-foreground mb-1">Total</p>
//                 <p className="text-2xl font-medium">
//                   {symbol}{totalExpenses.toFixed(0)}
//                 </p>
//                 <p className="text-xs text-muted-foreground mt-1">
//                   Click to explore
//                 </p>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Legend */}
//       <div className="mt-6 space-y-3 max-h-60 overflow-y-auto">
//         {data.map((item, index) => {
//           const category = categories.find(c => c.name === item.name);
//           const isSelected = displayIndex === index;
          
//           return (
//             <button
//               key={item.name}
//               onClick={() => onPieClick(null, index)}
//               onMouseEnter={() => onPieEnter(null, index)}
//               onMouseLeave={onPieLeave}
//               className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
//                 isSelected 
//                   ? 'bg-muted shadow-sm scale-[1.02]' 
//                   : 'hover:bg-muted/50'
//               }`}
//             >
//               <div className="flex items-center gap-3 flex-1 min-w-0">
//                 <div
//                   className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
//                   style={{ backgroundColor: category?.color + '20' }}
//                 >
//                   <CategoryIcon 
//                     name={category?.icon || 'DollarSign'} 
//                     color={category?.color || '#666'} 
//                     size={18} 
//                   />
//                 </div>
//                 <span className="text-sm truncate">{item.name}</span>
//               </div>
//               <div className="text-right ml-4">
//                 <p className="text-sm font-medium">{symbol}{item.value.toFixed(0)}</p>
//                 <p className="text-xs text-muted-foreground">
//                   {((item.value / totalExpenses) * 100).toFixed(1)}%
//                 </p>
//               </div>
//             </button>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
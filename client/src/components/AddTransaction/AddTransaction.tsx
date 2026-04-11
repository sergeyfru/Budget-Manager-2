// import { useState } from "react";
// import { useCategoriesStore } from "../../store/categoriesStore";
// import { useTransactionStore } from "../../store/useTransactionsStore";
// import type { ReqAddTransactionSchema } from "../../schemas/transactionSchemas";

// export const AddTransaction = () => {
//   const categoryStore = useCategoriesStore();
//   const transactionStore = useTransactionStore();
//   const [transactions, setTransactions] = useState(
//     {} as ReqAddTransactionSchema,
//   );

//   if (categoryStore.categories.length === 0) {
//     categoryStore.getUserCategories();
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <h2>Add Transaction</h2>
//       <form action="">
//         <div className="mb-4">
//           <label
//             htmlFor="amount"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Amount
//           </label>
//           <input
//             type="number"
//             name="amount"
//             id="amount"
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//             placeholder="Enter amount"
//             value={transactions.transaction_amount || ""}
//             onChange={(e) =>
//               setTransactions({
//                 ...transactions,
//                 transaction_amount: parseFloat(e.target.value),
//               })
//             }
//           />
//         </div>
//         <div className="mb-4">
//           <label
//             htmlFor="currency"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Currency
//           </label>
//           <select
//             value={transactions.currency_id || "3"}
//             onChange={(e) =>
//               setTransactions({
//                 ...transactions,
//                 currency_id: parseInt(e.target.value),
//               })
//             }
//             name="currency"
//             id="currency"
//             className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//           >
//             <option value="3" selected>
//               ILS
//             </option>
//             <option value="1">USD</option>
//             <option value="2">EUR</option>
//             <option value="4">GBP</option>
//           </select>

//         </div>
//         <div className="mb-4">
//           <label
//             htmlFor="category"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Category
//           </label>
//           <select
//             id="category"
//             name="category"
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//             value={transactions.user_category_id || ""}
//             onChange={(e) =>
//               setTransactions({
//                 ...transactions,
//                 user_category_id: parseInt(e.target.value),
//               })
//             }
//           >
//             <option value="" disabled>
//               Select category
//             </option>
//             {categoryStore.categories.map((category) => (
//               <option
//                 key={category.user_category_id}
//                 value={category.user_category_id}
//               >
//                 {category.user_category_name}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label
//             htmlFor="date"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Date
//           </label>
//           <input
//             type="date"
//             name="date"
//             id="date"
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//             value={transactions.date_of_transaction ? transactions.date_of_transaction.toISOString().split("T")[0] : ""}
//             onChange={(e) =>
//               setTransactions({
//                 ...transactions,
//                 date_of_transaction: new Date(e.target.value),
//               })
//             }
//           />
//         </div>
//         <div className="mb-4">
//           <label
//             htmlFor="note"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Note
//           </label>
//           <input
//             type="text"
//             name="note"
//             id="note"
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//             placeholder="Enter note (optional)"
//             value={transactions.transaction_note || ""}
//             onChange={(e) =>
//               setTransactions({
//                 ...transactions,
//                 transaction_note: e.target.value,
//               })
//             }
//           />
//         </div>
//         <button
//           type="submit"
//           className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//           onClick={(e) => {
//             e.preventDefault();
//             transactionStore.addTransaction(transactions);
//           }}
//         >
//           Add Transaction
//         </button>
//       </form>
//     </div>
//   );
// };

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCategoriesStore } from "../../store/categoriesStore";
import { useTransactionStore } from "../../store/transactionsStore";

import { createTransactionFormSchema, type CreateTransactionForm } from "@shared/core";

export const AddTransaction = () => {
  const categoryStore = useCategoriesStore();
  const transactionStore = useTransactionStore();

  useEffect(() => {
    if (categoryStore.categories.length === 0) {
      categoryStore.getUserCategories();
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTransactionForm>({
    resolver: zodResolver(createTransactionFormSchema),
    mode: "onChange",
    defaultValues: {
      currency_id: 3,
      date_of_transaction: new Date(),
    },
  });

  const onSubmit = (data: CreateTransactionForm) => {
    transactionStore.addTransaction(data);
  };

  if (categoryStore.categories.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Add Transaction</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Amount */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Amount</label>
          <input
            type="number"
            step="0.01"
            {...register("transaction_amount", {
              valueAsNumber: true,
            })}
            className="mt-1 w-full border rounded p-2"
          />
          {errors.transaction_amount && <p className="text-red-500 text-xs">{errors.transaction_amount.message}</p>}
        </div>

        {/* Currency */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Currency</label>
          <select {...register("currency_id", { valueAsNumber: true })} className="mt-1 w-full border rounded p-2">
            <option value={3}>ILS</option>
            <option value={1}>USD</option>
            <option value={2}>EUR</option>
            <option value={4}>GBP</option>
          </select>
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Category</label>
          <select {...register("user_category_id", { valueAsNumber: true })} className="mt-1 w-full border rounded p-2">
            <option value="">Select category</option>

            {categoryStore.categories.map((category) => (
              <option key={category.user_category_id} value={category.user_category_id}>
                {category.user_category_name}
              </option>
            ))}
          </select>

          {errors.user_category_id && <p className="text-red-500 text-xs">{errors.user_category_id.message}</p>}
        </div>

        {/* Date */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Date</label>
          <input
            type="date"
            {...register("date_of_transaction", {
              valueAsDate: true,
            })}
            className="mt-1 w-full border rounded p-2"
          />

          {errors.date_of_transaction && <p className="text-red-500 text-xs">{errors.date_of_transaction.message}</p>}
        </div>

        {/* Note */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Note</label>
          <input
            placeholder="Enter note (optional)"
            type="text"
            {...register("transaction_note")}
            className="mt-1 w-full border rounded p-2"
          />
        </div>

        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
          Add Transaction
        </button>
      </form>
    </div>
  );
};

import { create } from "zustand";

import { transactionsApi } from "../api/trasactionsApi";
import type { 
  ReqCreateTransaction, ReqUpdateTransaction,
   Status, TransactionsDetailedArr
  } from "@shared/core";
import { persist } from "zustand/middleware";

type TransactionState = {
  transactions: TransactionsDetailedArr;
  transactionsStatus: Status;
  transactionsError: string | null;

  // actions
  setTransactions: (data: TransactionsDetailedArr) => void;
  getTransactions: () => void;
  addTransaction: (data: ReqCreateTransaction) => void;
  updateTransaction: (transaction_id: number, data: ReqUpdateTransaction) => void;
  deleteTransaction: (id: number) => void;

  setLoading: (value: boolean) => void;
  setError: (message: string | null) => void;

  clear: () => void;
};

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set) => ({
      transactions: [] as TransactionsDetailedArr,
      transactionsStatus: "idle",
      transactionsError: null,

      setTransactions: async (data: TransactionsDetailedArr) => {
        set(() => ({
          transactions: data,
        }));
      },
      getTransactions: async () => {
        console.log("In getTransaction");
        set({ transactionsStatus: "loading", transactionsError: null });

        const response = await transactionsApi.getTransactions();
        console.log("Response from API:", response);

        if (response.status === "error") {
          set(() => ({
            transactionsStatus: "error",
            transactionsError: response.message || "Failed to fetch transactions",
          }));
          return;
        }
        set(() => ({
          transactions: response.data,
          transactionsStatus: "success",
        }));
      },

      addTransaction: async (data) => {
        set({ transactionsStatus: "loading", transactionsError: null });
        const response = await transactionsApi.addTransaction(data);
        if (response.status === "error") {
          set(() => ({
            transactionsStatus: "error",
            transactionsError: response.message || "Failed to add transaction",
          }));
          return;
        }
        set((state) => ({
          transactions: [response.data, ...state.transactions],
          transactionsStatus: "success",
          transactionsError: null,
        }));
      },

      updateTransaction: async (transaction_id, data) => {
        set({ transactionsStatus: "loading", transactionsError: null });
        const response = await transactionsApi.updateTransaction(transaction_id, data);

        if (response.status === "error") {
          set(() => ({
            transactionsStatus: "error",
            transactionsError: response.message || "Failed to update transaction",
          }));
          return;
        }

        set((state) => ({
          transactions: state.transactions.map((item) =>
            item.transaction_id === response.data.transaction_id ? response.data : item,
          ),
          transactionsStatus: "success",
          transactionsError: null,
        }));
      },

      deleteTransaction: async (id) => {
        set({ transactionsStatus: "loading", transactionsError: null });
        const response = await transactionsApi.deleteTransaction(id);
        if (response.status === "error") {
          set(() => ({
            transactionsStatus: "error",
            transactionsError: response.message || "Failed to delete transaction",
          }));
          return;
        }
        set((state) => ({
          transactions: state.transactions.filter((item) => item.transaction_id !== id),
          transactionsStatus: "success",
          transactionsError: null,
        }));
      },

      setLoading: (value) =>
        set(() => ({
          transactionsStatus: value ? "loading" : "idle",
          transactionsError: null,
        })),

      setError: (message) =>
        set(() => ({
          transactionsError: message,
        })),

      clear: () =>
        set(() => ({
          transactions: [],
          transactionsStatus: "idle",
          transactionsError: null,
        })),
    }),
    {
      name: "transaction-storage",
      partialize: (state) => ({
        transactions: state.transactions,
      }),
    },
  ),
);

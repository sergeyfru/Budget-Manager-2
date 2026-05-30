import { create } from "zustand";

import { transactionsApi } from "../api/trasactionsApi";
import type {
  ReqCreateTransaction,
  ReqUpdateTransaction,
  Status,
  TransactionsDetailedArr,
  TransactionTypesArrDB,
} from "@shared/core";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import type { AxiosError } from "axios";

type TransactionState = {
  transactions: TransactionsDetailedArr;
  transactionsStatus: Status;
  transactionsError: string | null;

  transactionTypes: TransactionTypesArrDB;
  transactionTypesStatus: Status;
  transactionTypesError: string | null;

  // actions
  getTransactionTypes: () => void;

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
      transactionTypes: [] as TransactionTypesArrDB,
      transactionTypesStatus: "idle",
      transactionTypesError: null,

      getTransactionTypes: async () => {
        try {
          set({ transactionTypesStatus: "loading", transactionTypesError: null });
          const response = await transactionsApi.getTransactionTypes();
          if (response.status === "error") {
            set({
              transactionTypesStatus: "error",
              transactionTypesError: response.message || "Failed to fetch transaction types",
            });
            return;
          }
          set({
            transactionTypes: response.data.sort((a, b) => a.transaction_type_id - b.transaction_type_id),
            transactionTypesStatus: "success",
          });
        } catch (error: AxiosError | any) {
          console.error(error);
          set({
              transactionTypesStatus: "error",
              transactionTypesError: error.response?.data?.message || error.message || "Failed to fetch transaction types",
          });
          toast.error("Failed to fetch transaction types");
        }
      },

      setTransactions: async (data: TransactionsDetailedArr) => {
        set(() => ({
          transactions: data,
        }));
      },

      getTransactions: async () => {
        console.log("In getTransaction");
        set({ transactionsStatus: "loading", transactionsError: null });
        try {
          const response = await transactionsApi.getTransactions();
          console.log("Response from API:", response);

          if (response.status === "error") {
            set(() => ({
              transactionsStatus: "error",
              transactionsError: response.message || "Failed to fetch transactions",
            }));
            toast.error(response.message || "Failed to fetch transactions");
            return;
          }
          set(() => ({
            transactions: response.data,
            transactionsStatus: "success",
          }));
        } catch (error: AxiosError | any) {
          console.error(error);
          set({
              transactionsStatus: "error",
              transactionsError: error.response?.data?.message || error.message || "Failed to fetch transactions",
          });
          toast.error("Failed to fetch transactions");
        }
      },

      addTransaction: async (data) => {
        try {
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
        } catch (error: AxiosError | any) {
          console.error(error);
          set({
              transactionsStatus: "error",
              transactionsError: error.response?.data?.message || error.message || "Failed to add new transaction",
          });
          toast.error("Failed to add new transaction");
        }
      },

      updateTransaction: async (transaction_id, data) => {
        try {
          set({ transactionsStatus: "loading", transactionsError: null });
          const response = await transactionsApi.updateTransaction(transaction_id, data);

          if (response.status === "error") {
            set(() => ({
              transactionsStatus: "error",
              transactionsError: response.message || "Failed to update the transaction",
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
        } catch (error: AxiosError | any) {
          console.error(error);
          set({
              transactionsStatus: "error",
              transactionsError: error.response?.data?.message || error.message || "Failed to update the transaction",
          });
          toast.error("Failed to update the transaction");
        }
      },

      deleteTransaction: async (id) => {
        try {
          set({ transactionsStatus: "loading", transactionsError: null });
          const response = await transactionsApi.deleteTransaction(id);
          if (response.status === "error") {
            set(() => ({
              transactionsStatus: "error",
              transactionsError: response.message || "Failed to delete the transaction",
            }));
            return;
          }
          set((state) => ({
            transactions: state.transactions.filter((item) => item.transaction_id !== id),
            transactionsStatus: "success",
            transactionsError: null,
          }));
        } catch (error: AxiosError | any) {
          console.error(error);
          set({
              transactionsStatus: "error",
              transactionsError: error.response?.data?.message || error.message || "Failed to delete the transaction",
          });
          toast.error("Failed to delete the transaction");
        }
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
        transactionTypes: state.transactionTypes,
      }),
    },
  ),
);

import { create } from "zustand";
import {
  type ReqAddTransactionSchema,
  type ReqUpdateTransactionSchema,
  type TransactionFullSchema,
  type TransactionsResponseArraySchema,
} from "../schemas/transactionSchemas";
import { transactionsApi } from "../api/trasactionsApi";

type TransactionState = {
  transactions: TransactionsResponseArraySchema;

  isLoading: boolean;
  error: string | null;

  // actions
  setTransactions: (data: TransactionsResponseArraySchema) => void;
  getTransactions: () => void;
  addTransaction: (tx: ReqAddTransactionSchema) => void;
  updateTransaction: (tx: ReqUpdateTransactionSchema) => void;
  removeTransaction: (id: number) => void;

  setLoading: (value: boolean) => void;
  setError: (message: string | null) => void;

  clear: () => void;
};

export const useTransactionStore = create<TransactionState>((set) => ({

  transactions: [] as TransactionsResponseArraySchema,
  isLoading: false,
  error: null,

  setTransactions: async (data: TransactionsResponseArraySchema) => {
    set(() => ({
      transactions: data,
    }));
  },
  getTransactions: async () => {
    console.log("In getTransaction");
    set({ isLoading: true, error: null });

    const response = await transactionsApi.getTransactions();
    set(() => ({
      transactions: response.transactions,
      isLoading: false,
    }));
  },

  addTransaction: async (tx) => {
    const newTx: TransactionFullSchema =
      await transactionsApi.addTransaction(tx);
    set((state) => ({
      transactions: [newTx, ...state.transactions],
    }));
    window.location.href = "/";

  },

  updateTransaction: (tx) => {
    console.log("This Function is In Progress", tx);
  },

  removeTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter(
        (item) => item.transaction_id !== id,
      ),
    })),

  setLoading: (value) =>
    set(() => ({
      isLoading: value,
    })),

  setError: (message) =>
    set(() => ({
      error: message,
    })),

  clear: () =>
    set(() => ({
      transactions: [],
      isLoading: false,
      error: null,
    })),
}));

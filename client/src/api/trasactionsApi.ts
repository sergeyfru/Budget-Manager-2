import type {
  ReqCreateTransaction,
  ReqUpdateTransaction,
  ResSimple,
  ResTransactionDetailed,
  ResTransactionsDetailedArr,
  ResTransactionTypesArr,
} from "@shared/core";
import { api } from "./axios";

export const transactionsApi = {
  getTransactions: (): Promise<ResTransactionsDetailedArr> =>
    api.get("/transactions").then((res) => res.data),

  getTransactionTypes: (): Promise<ResTransactionTypesArr> =>
    api.get("/transactions/transactiontypes").then((res) => res.data),

  addTransaction: (data: ReqCreateTransaction): Promise<ResTransactionDetailed> =>
    api.post("/transactions/", data).then((res) => res.data),

  updateTransaction: (transaction_id: number, data: ReqUpdateTransaction): Promise<ResTransactionDetailed> =>
    api.patch(`/transactions/${transaction_id}`, data).then((res) => res.data),
  
  deleteTransaction: (transaction_id: number): Promise<ResSimple> =>
    api.delete(`/transactions/${transaction_id}`).then((res) => res.data),
};

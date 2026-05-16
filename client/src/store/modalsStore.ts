import type { TransactionDB } from "@shared/core";
import { create } from "zustand";

interface modalsStoreProps {
    addEditTransactionModalOpen: boolean;
    setAddEditTransactionModalOpen: (open: boolean) => void;
    editingTransaction: TransactionDB|null;
    setEditingTransaction: (transaction: TransactionDB) => void;
    resetTransactionModalStore: () => void;


}

export const useModalsStore = create<modalsStoreProps>()(
(set)=>({
    addEditTransactionModalOpen: false,
    setAddEditTransactionModalOpen: (open) => set({ addEditTransactionModalOpen: open }),
    editingTransaction: null,
    setEditingTransaction: (transaction) => set({ editingTransaction: transaction }),
    resetTransactionModalStore: () => set({ editingTransaction: null, addEditTransactionModalOpen: false }),
})
)
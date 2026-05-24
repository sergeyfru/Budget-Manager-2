import type { CurrencyDB } from "@shared/core";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type SettingsState = {
  addTransactionModalOpen: boolean;
  setAddTransactionModalOpen: (addTransactionModalOpen: boolean) => void;
  defaultCurrency: CurrencyDB | null;
  setSelectedCurrency: (currency: CurrencyDB) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export type Theme = "light"|"dark"

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "light",
      setTheme: (theme) => {
        set({ theme });
      },
      addTransactionModalOpen: false,

      setAddTransactionModalOpen: (addTransactionModalOpen) => {
        set({ addTransactionModalOpen });
      },

      defaultCurrency: {
        currency_id: 3,
        currency_code: "ILS",
        currency_symbol: "₪",
        currency_name: "Israeli New Shekel",
        created_at: new Date("2026-03-14T18:15:09"),
      },

      setSelectedCurrency: (currency: CurrencyDB) => {
        set({ defaultCurrency: currency });
      },
    }),
    {
      name: "settings-storage", // name of the item in storage
      partialize: (state) => ({
        defaultCurrency: state.defaultCurrency,
      }),
    },
  ),
);

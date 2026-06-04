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
  clear: ()=>void;
};

export type Theme = "light" | "system" | "dark";

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: (localStorage.getItem("theme") as Theme) || "system",
      setTheme: (theme) => {
        localStorage.setItem('theme',theme)
        set({ theme });
      },
      addTransactionModalOpen: false,

      setAddTransactionModalOpen: (addTransactionModalOpen) => {
        set({ addTransactionModalOpen });
      },

      defaultCurrency: {
            "currency_id": 3,
            "currency_code": "ILS",
            "currency_symbol": "₪",
            "currency_name": "Israeli New Shekel",
            "currency_country": "Israel",
            "currency_flag": null,
            "currency_time_last_update_unix": 1780531201,
            "currency_time_next_update_unix": 1780617601,
            "currency_exchange_rate_usd": 2.87,
            "currency_rate_updated_at": new Date("2026-06-04T00:00:01.000Z"),
            "created_at": new Date("2026-06-03T06:54:59.888Z")
        },

      setSelectedCurrency: (currency: CurrencyDB) => {
        set({ defaultCurrency: currency });
      },

      clear:()=>{
        set({defaultCurrency:null, theme:"system"})
      }
    }),
    {
      name: "settings-storage",
      partialize: (state) => ({
        defaultCurrency: state.defaultCurrency,
      }),
    },
  ),
);

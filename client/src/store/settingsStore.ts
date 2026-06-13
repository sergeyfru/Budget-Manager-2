import type { CurrencyDB } from "@shared/core";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { userSettingsApi } from "../api/userSettingsApi";
import { toast } from "sonner";

type SettingsState = {
  addTransactionModalOpen: boolean;
  setAddTransactionModalOpen: (addTransactionModalOpen: boolean) => void;
  defaultCurrency: CurrencyDB | null;
  getBaseCurrency: ()=> void;
  setSelectedCurrency: (currency: CurrencyDB) => void;
  updateDefaultCurrency: (currency: CurrencyDB) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  clear: () => void;
};

export type Theme = "light" | "system" | "dark";

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: (localStorage.getItem("theme") as Theme) || "system",
      setTheme: (theme) => {
        localStorage.setItem("theme", theme);
        set({ theme });
      },
      addTransactionModalOpen: false,

      setAddTransactionModalOpen: (addTransactionModalOpen) => {
        set({ addTransactionModalOpen });
      },

      defaultCurrency: null,
      // {
      //   currency_id: 1,
      //   currency_code: "USD",
      //   currency_symbol: "$",
      //   currency_name: "United States Dollar",
      //   currency_country: "United States",
      //   currency_flag: null,
      //   currency_time_last_update_unix: 1780531201,
      //   currency_time_next_update_unix: 1780617601,
      //   currency_exchange_rate_usd: 1,
      //   currency_rate_updated_at: new Date("2026-06-04T00:00:01.000Z"),
      //   created_at: new Date("2026-06-03T06:54:59.888Z"),
      // },

      getBaseCurrency: async()=> {
        try {
          const response = await userSettingsApi.getBaseCurrency();

          if(response.status === "error") return
          
          set({ defaultCurrency: response.data });

        } catch (error) {
          console.error(error);
          toast.error("Failed to update base currency type");
        }
      },

      setSelectedCurrency: async (currency: CurrencyDB) => {
        try {
          const response = await userSettingsApi.changeBaseCurrency(currency.currency_id);

          response.status === "success"
            ? toast.success(`Currency set to ${currency?.currency_name}`)
            : toast.error(response.message);
          set({ defaultCurrency: currency });
        } catch (error) {
          console.error(error);
          toast.error("Failed to update base currency type");
        }
      },

      updateDefaultCurrency: async (currency: CurrencyDB) => {
        try {
          set({ defaultCurrency: currency });
        } catch (error) {
          console.error(error);
          toast.error("Failed to update base currency type");
        }
      },

      clear: () => {
        set({
          defaultCurrency: null,
          // {
          //   currency_id: 1,
          //   currency_code: "USD",
          //   currency_symbol: "$",
          //   currency_name: "United States Dollar",
          //   currency_country: "United States",
          //   currency_flag: null,
          //   currency_time_last_update_unix: 1780531201,
          //   currency_time_next_update_unix: 1780617601,
          //   currency_exchange_rate_usd: 1,
          //   currency_rate_updated_at: new Date("2026-06-04T00:00:01.000Z"),
          //   created_at: new Date("2026-06-03T06:54:59.888Z"),
          // },
          theme: "system",
        });
      },
    }),
    {
      name: "settings-storage",
      partialize: (state) => ({
        defaultCurrency: state.defaultCurrency,
      }),
    },
  ),
);

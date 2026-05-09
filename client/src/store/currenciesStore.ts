
import type { CurrenciesArrDB, Status } from "@shared/core";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { currenciesApi } from "../api/currenciesApi";

type currenciesState = {
  currencies: CurrenciesArrDB;
  currenciesStatus: Status;
  currenciesError: string | null;

  getCurrencies: () => void;
};

export const useCurrenciesStore = create<currenciesState>()(
  persist((set) => ({
    currencies: [] as CurrenciesArrDB,
    currenciesStatus: "idle",
    currenciesError: null,
    
    getCurrencies: async () => {
      set({ currenciesStatus: "loading", currenciesError: null });
      const response = await currenciesApi.getCurrensies();
      if (response.status === "error") {
        console.error("Failed to fetch currencies: ", response.message);
        set({ currenciesStatus: "error", currenciesError: response.message || "Failed to fetch currencies" });
        return;
      }
      set({ currencies: response.data.sort((a,b)=>a.currency_id-b.currency_id), currenciesStatus: "success" });
    }
}),
{
  name: "currencies-storage", // name of the item in storage
  partialize: (state) => ({
    currencies: state.currencies,
  }),
}));

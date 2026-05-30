import type { CurrenciesArrDB, Status } from "@shared/core";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { currenciesApi } from "../api/currenciesApi";
import { toast } from "sonner";
import type { AxiosError } from "axios";

type currenciesState = {
  currencies: CurrenciesArrDB;
  currenciesStatus: Status;
  currenciesError: string | null;

  getCurrencies: () => void;
};

export const useCurrenciesStore = create<currenciesState>()(
  persist(
    (set) => ({
      currencies: [] as CurrenciesArrDB,
      currenciesStatus: "idle",
      currenciesError: null,

      getCurrencies: async () => {
        try {
          set({ currenciesStatus: "loading", currenciesError: null });
          const response = await currenciesApi.getCurrensies();
          if (response.status === "error") {
            console.error("Failed to fetch currencies: ", response.message);
            set({ currenciesStatus: "error", currenciesError: response.message || "Failed to fetch currencies" });
            return;
          }
          set({ currencies: response.data.sort((a, b) => a.currency_id - b.currency_id), currenciesStatus: "success" });
        } catch (error: AxiosError | any) {
          console.error(error);
          set({
            currenciesStatus: "error",
            currenciesError: error.response?.data?.message || error.message || "Failed to fetch currencies",
          });
          toast.error("Failed to fetch currencies");
        }
      },
    }),
    {
      name: "currencies-storage", // name of the item in storage
      partialize: (state) => ({
        currencies: state.currencies,
      }),
    },
  ),
);

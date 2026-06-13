import { Suspense } from "react";
import { Spinner } from "../components/Loading/Spiner";
import { useSettingsStore } from "../store/settingsStore";
import { useCurrenciesStore } from "../store/currenciesStore";
import { useCategoriesStore } from "../store/categoriesStore";
import { usePaymentMethodsStore } from "../store/paymentMethodsStore";
import { useTransactionStore } from "../store/transactionsStore";

export const withSuspense = (component: React.ReactNode) => (
  <Suspense
    fallback={
      <div className="flex items-center justify-center w-full h-full min-h-[90vh]">
        <Spinner size={64} />
      </div>
    }
  >
    {component}
  </Suspense>
);

export const clearStores = () => {
  useTransactionStore.getState().clear();
  useSettingsStore.getState().clear();
  usePaymentMethodsStore.getState().clear();
  useCurrenciesStore.getState().clear();
  useCategoriesStore.getState().clear();
};

import { lazy } from "react";
import { Navigate, Outlet } from "react-router";
import { useMediaQuery } from "react-responsive";
import { BottomNav } from "../Navigation/BottomNav.tsx";
import { useEffect } from "react";
import { useAuthStore } from "../../store/authStore.ts";
import { Sidebar } from "../Navigation/SideBar.tsx";
const AddTransactionModal = lazy(() => import("../AddTransaction/AddTransactionModal.tsx"));
import { useModalsStore } from "../../store/modalsStore.ts";
import { breakpoints } from "../../constants/constants.ts";
import { useTransactionStore } from "../../store/transactionsStore.ts";
import { useCategoriesStore } from "../../store/categoriesStore.ts";
import { usePaymentMethodsStore } from "../../store/paymentMethodsStore.ts";
import { useCurrenciesStore } from "../../store/currenciesStore.ts";
import { useSettingsStore } from "../../store/settingsStore.ts";

export const Layout = () => {
  const { editingTransaction, addEditTransactionModalOpen, setAddEditTransactionModalOpen } = useModalsStore();
  const isAutorized = useAuthStore((state) => state.isAuth);
  const isDesktop = useMediaQuery({ minWidth: breakpoints.lg });

  const { transactionTypes, getTransactionTypes } = useTransactionStore();
  const { categories, getUserCategories } = useCategoriesStore();
  const { paymentMethods, getUserPaymentMethods } = usePaymentMethodsStore();
  const { currencies, getCurrencies } = useCurrenciesStore();
  const { defaultCurrency, updateDefaultCurrency } = useSettingsStore();

  useEffect(() => {
    if (!isAutorized) {
      <Navigate to="/login" replace />;
    }
  }, [isAutorized]);

  useEffect(() => {
    if (transactionTypes.length === 0) {
      getTransactionTypes();
    }
    if (paymentMethods.length === 0) {
      getUserPaymentMethods();
    }
    if (currencies.length === 0 || currencies[0].currency_time_next_update_unix < Math.floor(Date.now() / 1000)) {
      getCurrencies();
      const defaultCurrencyId = defaultCurrency.currency_id;
      const updatedDefCur = currencies.filter((c) => c.currency_id === defaultCurrencyId);
      updateDefaultCurrency(updatedDefCur[0]);
    }
    if (categories.length === 0) {
      getUserCategories();
    }
  }, []);

  const addTransaction = () => {
    setAddEditTransactionModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="min-h-screen lg:ml-64 xl:ml-72">
        <Outlet />
      </main>

      {/* Navigation */}
      {isDesktop && <Sidebar onAddClick={addTransaction} />}
      {!isDesktop && <BottomNav onAddClick={addTransaction} />}

      {/* Add Transaction Modal */}
      {addEditTransactionModalOpen && <AddTransactionModal dataForUpdate={editingTransaction} />}
    </div>
  );
};

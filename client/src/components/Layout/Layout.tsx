import { lazy } from "react";
import { Navigate, Outlet } from "react-router";
import { useMediaQuery } from "react-responsive";
import { BottomNav } from "../Navigation/BottomNav.tsx";
import { useEffect } from "react";
import { useAuthStore } from "../../store/authStore.ts";
import { Sidebar } from "../Navigation/SideBar.tsx";
const AddTransactionModal = lazy(() => import("../AddTransaction/AddTransactionModal.tsx"));
import { useModalsStore } from "../../store/modalsStore.ts";
import { BREAKPOINTS } from "../../constants/constants.ts";

export const Layout = () => {
  const { editingTransaction, addEditTransactionModalOpen, setAddEditTransactionModalOpen } = useModalsStore();
  const isAutorized = useAuthStore((state) => state.isAuth);
  const isDesktop = useMediaQuery({ minWidth: BREAKPOINTS.lg });

  useEffect(() => {
    if (!isAutorized) {
      <Navigate to="/login" replace />;
    }
  }, [isAutorized]);

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

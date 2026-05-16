import { Navigate, Outlet } from "react-router";
import { BottomNav } from "../Navigation/BottomNav.tsx";
import { useEffect } from "react";
import { useAuthStore } from "../../store/authStore.ts";
import { Sidebar } from "../Navigation/SideBar.tsx";
import { AddTransactionModal } from "../AddTransaction/AddTransactionModal.tsx";
import { useModalsStore } from "../../store/modalsStore.ts";

export const Layout = () => {
  const { editingTransaction, addEditTransactionModalOpen, setAddEditTransactionModalOpen } = useModalsStore();
  const isAutorized = useAuthStore((state) => state.isAuth);

  useEffect(() => {
    if (!isAutorized) {
      // If the user is not authorized, redirect to the login page
      <Navigate to="/login" replace />;
    }
  }, [isAutorized]);

  const addTransaction = () => {
    setAddEditTransactionModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <Sidebar onAddClick={addTransaction} />

      {/* Main Content */}
      <main className="min-h-screen lg:ml-64 xl:ml-72">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden">
        <BottomNav onAddClick={addTransaction} />
      </div>

      {/* Add Transaction Modal */}
      {addEditTransactionModalOpen && <AddTransactionModal dataForUpdate={editingTransaction} />}
    </div>
  );
};

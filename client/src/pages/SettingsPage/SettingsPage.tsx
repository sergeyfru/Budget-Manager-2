import { useNavigate } from "react-router";
import { Greeting } from "../../components/Greeting/Greeting";
import { useAuthStore } from "../../store/authStore";
import { CategoriesCard } from "../../components/CategoriesCard/CategoriesCard";
import { PaymentMethodsCard } from "../../components/PaymentMethodsCard/PaymentMethodsCard";
import { UserCard } from "../../components/UserCard/UserCard";
import { LogOut } from "lucide-react";

const SettingsPage = () => {
  const authStore = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authStore.logout();
    navigate("/login");
  };
  return (
    <div className="min-h-screen pb-20 lg:pb-8">
      <Greeting title="Settings" subtitle="Manage your preferences" />
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12 py-6 lg:py-8 flex flex-col gap-3">
        <UserCard />
        <CategoriesCard />
        <PaymentMethodsCard />
        <div className="px-4 sm:px-6 lg:px-8 xl:px-12 py-6 lg:py-8 pb-24 lg:pb-8">
          <button onClick={handleLogout} className="flex gap-2">
            <LogOut />
            <span>Sing Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage
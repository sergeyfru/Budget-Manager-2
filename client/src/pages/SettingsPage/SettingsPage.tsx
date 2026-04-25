import { useNavigate } from "react-router";
import { CustomIcon } from "../../components/CustomIcons/CustomIcons";
import { Greeting } from "../../components/Greeting/Greeting";
import { useAuthStore } from "../../store/authStore";

export const SettingsPage = () => {

    const authStore = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async() => {
        await authStore.logout();
        navigate("/login");
    }; 
  return (
    <>
      <Greeting title="Settings" subtitle="Manage your preferences" />
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12 py-6 lg:py-8 pb-24 lg:pb-8">
      <button onClick={handleLogout} className="flex gap-2"><CustomIcon name="LogOut"/><span>Sing Out</span></button>
      </div>
    </>
  );
};

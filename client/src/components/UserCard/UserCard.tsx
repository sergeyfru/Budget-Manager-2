import { Lock, LogOut, Mail } from "lucide-react";
import { SectionWrapper } from "../SettingsComponents/SectionWrapper";
import { SectionRow } from "../SettingsComponents/SectionRow";
import { useAuthStore } from "../../store/authStore";
import { useState } from "react";
import { ChangePasswordModal } from "../ChangePasswordModal/ChangePasswordModal";
import { useNavigate } from "react-router";

export const UserCard = () => {
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [logOutLoading, setLogOutLoading] = useState(false);

  const authStore = useAuthStore();

  const handleLogout = async () => {
    setLogOutLoading(true);
    try {
      await authStore.logout();
      navigate("/login");
    } finally {
      setLogOutLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 xl:px-10 py-6 max-w-2xl space-y-6">
      <SectionWrapper title="Account">
        <SectionRow
          icon={Mail}
          label={authStore.user?.email || "youremail@example.com"}
          description="Your account email"
        />
        <SectionRow
          icon={Lock}
          label="Change Password"
          description="Update your account password"
          onClick={() => setShowPasswordModal(true)}
        />
        <SectionRow
          icon={LogOut}
          label="Log out"
          description="Sign out of your account"
          onClick={handleLogout}
          disabled={logOutLoading}
        />
      </SectionWrapper>
      {showPasswordModal && <ChangePasswordModal setModalOpen={setShowPasswordModal} />}
    </div>
  );
};

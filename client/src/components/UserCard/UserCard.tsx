import { useState } from "react";
import { CardsTitleInSettings } from "../CardsTitleInSettings/CardsTitleInSettings";
import { useSettingsStore } from "../../store/settingsStore";
import { ModalFormContainer } from "../ModalComponents/ModalContainer";
import { ChangePasswordModal } from "../ChangePasswordModal/ChangePasswordModal";

export const UserCard = () => {
  const [callapseCategoriesCard, setCallapseCategoriesCard] = useState(true);
  const { setDarkTheme, darkTheme } = useSettingsStore();
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const openCard = () => {
    setCallapseCategoriesCard(!callapseCategoriesCard);
  };

  return (
    <div className="bg-card flex flex-col gap-4 border border-border rounded-2xl p-5 sm:p-6 md:p-8 shadow-sm">
      <CardsTitleInSettings
        title="User Settings"
        cardIsClose={callapseCategoriesCard}
        setCardIsClose={openCard}
        //  refreshCard={refreshCategories}
        //  setShowAddModal={setShowAddModal}
      />

      {!callapseCategoriesCard && (
        <div className="flex items-start flex-col gap-3 pt-2">
          <button
            type="button"
            className="p-2 rounded-xl border border-border bg-card text-foreground hover:bg-muted transition-colors"
            onClick={() => setDarkTheme(!darkTheme)}
          >
            <h2>Theme</h2>
            <h3>{darkTheme ? "Dark" : "Light"} Mode</h3>
          </button>
          <button
            type="button"
            className="p-2 rounded-xl border border-border bg-card text-foreground hover:bg-muted transition-colors"
            onClick={() => setShowPasswordModal(true)}
          >
            <h2>Change Password</h2>
          </button>
        </div>
      )}
      {showPasswordModal && <ChangePasswordModal setModalOpen={setShowPasswordModal} />}
    </div>
  );
};

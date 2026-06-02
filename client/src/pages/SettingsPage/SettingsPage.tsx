import { Greeting } from "../../components/Greeting/Greeting";
import { UserCard } from "../../components/UserCard/UserCard";
import { ThemeSwitcher } from "../../components/ThemeSwitcher/ThemeSwitcher";
import { useMediaQuery } from "react-responsive";
import { BREAKPOINTS } from "../../constants/constants";
import { PreferencesCard } from "../../components/PreferencesCard/PreferencesCard";

const SettingsPage = () => {
  const isDesktop = useMediaQuery({ minWidth: BREAKPOINTS.lg });

  return (
    <div className="min-h-screen pb-20 lg:pb-8">
      <Greeting title="Settings" subtitle="Manage your preferences">
        {!isDesktop && <ThemeSwitcher />}
      </Greeting>
     
        <UserCard />
        <PreferencesCard />

    </div>
  );
};

export default SettingsPage;

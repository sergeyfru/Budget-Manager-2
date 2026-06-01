import { Greeting } from "../../components/Greeting/Greeting";
import { UserCard } from "../../components/UserCard/UserCard";
import { ThemeSwitcher } from "../../components/ThemeSwitcher/ThemeSwitcher";
import { useMediaQuery } from "react-responsive";
import { BREAKPOINTS } from "../../constants/constants";

const SettingsPage = () => {
  const isDesktop = useMediaQuery({ minWidth: BREAKPOINTS.lg });

  return (
    <div className="min-h-screen pb-20 lg:pb-8">
      <Greeting title="Settings" subtitle="Manage your preferences">
        {!isDesktop && <ThemeSwitcher />}
      </Greeting>
      {/* <div className="px-4 sm:px-6 lg:px-8 xl:px-12 py-6 lg:py-8 flex flex-col gap-3"> */}
     
        <UserCard />
      {/* </div> */}
    </div>
  );
};

export default SettingsPage;

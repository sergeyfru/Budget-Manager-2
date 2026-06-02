import { Globe } from "lucide-react";
import { SectionRow } from "../SettingsComponents/SectionRow";
import { SectionWrapper } from "../SettingsComponents/SectionWrapper";
import { CurrencySelector } from "../CurrencySelector/CurrencySelector";
import { BREAKPOINTS } from "../../constants/constants";
import { useMediaQuery } from "react-responsive";

export const PreferencesCard = () => {
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS.sm - 1 });

  return (
    <SectionWrapper title="Preferences">
      {!isMobile ? (
        <SectionRow icon={Globe} label="Currency" description="Used for all transactions">
          <CurrencySelector />
        </SectionRow>
      ) : (
        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-3.5 mb-3">
            <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
              <Globe className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Currency</p>
              <p className="text-xs text-muted-foreground">Used for all transactions</p>
            </div>
          </div>
          <CurrencySelector />
        </div>
      )}
    </SectionWrapper>
  );
};

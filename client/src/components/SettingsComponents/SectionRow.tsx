import { ChevronRight } from "lucide-react";
import { Spinner } from "../Loading/Spiner";

interface SectionRowProps {
  icon?: React.ElementType;
  label: string;
  description?: string;
  right?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
  disabled?:boolean;
}

export const SectionRow = ({ icon: Icon, label, description, danger, right, onClick,disabled }: SectionRowProps) => {
  const Wrapper = onClick ? "button" : "div";

  return (
    <Wrapper
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center justify-between p-4 sm:p-5 transition-colors text-left ${
        onClick ? (danger ? "hover:bg-destructive/5 text-destructive" : "hover:bg-muted/40") : ""
      }`}
    >
      <div className="flex items-center gap-3.5">
        {Icon && (
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center ${danger ? "bg-destructive/10" : "bg-muted"}`}
          >
            <Icon className={`w-4 h-4 ${danger ? "text-destructive" : "text-muted-foreground"}`} />
          </div>
        )}
        <div>
          <p className={`text-sm font-medium ${danger ? "text-destructive" : "text-foreground"}`}>{label}</p>
          {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
      </div>
      {right ?? (onClick && disabled ? <Spinner/>: <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />)}
    </Wrapper>
  );
};

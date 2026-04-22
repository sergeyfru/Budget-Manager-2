import { TrendingUp, type LucideIcon } from "lucide-react";

interface LogoGreetingProps {
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
}

export const LogoGreeting = ({
  title = "Welcome to Budget Manager",
  subtitle = "Start managing your finances",
  icon: Icon = TrendingUp,
}: LogoGreetingProps) => {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg mb-4">
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h1 className="mb-2">{title}</h1>
      <p className="text-muted-foreground">{subtitle}</p>
    </div>
  );
};

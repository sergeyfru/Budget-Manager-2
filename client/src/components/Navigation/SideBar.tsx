import { Link, useLocation } from "react-router";
import { TrendingUp, Plus } from "lucide-react";
import { ThemeSwitcher } from "../ThemeSwitcher/ThemeSwitcher";
import { navItems } from "../../constants/constants";

interface SidebarProps {
  onAddClick: () => void;
}

export function Sidebar({ onAddClick }: SidebarProps) {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 xl:w-72 bg-card border-r border-border flex-col z-40">
      {/* Logo / Brand */}
      <div className="h-20 flex items-center justify-between px-5 xl:px-7 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3>Budget</h3>
            <p className="text-xs text-muted-foreground">Manager</p>
          </div>
        </div>

        <ThemeSwitcher />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 xl:px-6 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          if(item?.isButton) return
          if(!item.path) return
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Add Transaction Button */}
      <div className="p-4 xl:p-6 border-t border-border">
        <button
          onClick={onAddClick}
          className="flex items-center justify-center gap-2 w-full py-3.5 bg-primary text-primary-foreground rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Add Transaction</span>
        </button>
      </div>
    </aside>
  );
}

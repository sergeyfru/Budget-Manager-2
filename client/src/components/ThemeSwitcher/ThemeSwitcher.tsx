import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import { useSettingsStore } from "../../store/settingsStore";

export type Theme = "light" | "dark" | "system";

export const ThemeSwitcher = () => {
  const {theme, setTheme} = useSettingsStore()
  
  const themes = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "system", icon: Monitor, label: "System" },
    { value: "dark", icon: Moon, label: "Dark" },
  ] satisfies {
    value: Theme;
    icon: LucideIcon;
    label: string;
  }[];
  

  return (
  
    <div className="flex items-center gap-px p-1 bg-muted rounded-lg border border-border/50">
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          title={label}
          className={`p-1.5 rounded-md transition-all ${
            theme === value ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Icon className="w-3.5 h-3.5" />
        </button>
      ))}
    </div>
  );
};

// export const ThemeSwitcher = () => {
//   const [theme, setTheme] = useState<Theme>(() => {
//     return (localStorage.getItem("theme") as Theme) || "system";
//   });

//   const themes = [
//     { value: "light", icon: Sun, label: "Light" },
//     { value: "system", icon: Monitor, label: "System" },
//     { value: "dark", icon: Moon, label: "Dark" },
//   ] satisfies {
//     value: Theme;
//     icon: LucideIcon;
//     label: string;
//   }[];
  

//   return (
//     <div className="flex items-center gap-px p-1 bg-muted rounded-lg border border-border/50">
//       {themes.map(({ value, icon: Icon, label }) => (
//         <button
//           key={value}
//           onClick={() => setTheme(value)}
//           title={label}
//           className={`p-1.5 rounded-md transition-all ${
//             theme === value ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
//           }`}
//         >
//           <Icon className="w-3.5 h-3.5" />
//         </button>
//       ))}
//     </div>
//   );
// };

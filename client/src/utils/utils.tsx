import { Suspense } from "react";
import { Spinner } from "../components/Loading/Spiner";
import { useEffect, useState } from "react";
export type Theme = "light" | "dark" | "system";
const STORAGE_KEY = "theme";

export const withSuspense = (component: React.ReactNode) => (
  <Suspense
    fallback={
      <div className="flex items-center justify-center w-full h-full min-h-[90vh]">
        <Spinner size={64} />
      </div>
    }
  >
    {component}
  </Suspense>
);

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem(STORAGE_KEY) as Theme) || "system";
  });
  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => {
      const isDark = theme === "dark" || (theme === "system" && mediaQuery.matches);

      if(theme === "dark"){
        root.classList.add("dark")
        root.classList.remove("light")
      }else if( theme === "light"){
        root.classList.add("light")
        root.classList.remove("dark")
      }else{
        root.classList.remove("dark")
        root.classList.remove("light")
      }
      // root.classList.toggle(theme);
      root.style.colorScheme = isDark ? "dark" : "light";
    };
    applyTheme();
    if (theme === "system") {
      mediaQuery.addEventListener("change", applyTheme);
    }
    localStorage.setItem(STORAGE_KEY, theme);
    return () => {
      mediaQuery.removeEventListener("change", applyTheme);
    };
  }, [theme]);

  return {
    theme,
    setTheme,
  };
};

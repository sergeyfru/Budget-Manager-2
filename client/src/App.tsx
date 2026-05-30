import { RouterProvider } from "react-router";
import { Toaster } from "sonner";
import { router } from "./routes";
import { useEffect } from "react";
import { useSettingsStore } from "./store/settingsStore";

function App() {
  const { theme } = useSettingsStore();
  
  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const isDark = theme === "dark" || (theme === "system" && mediaQuery.matches);

      root.classList.toggle("dark", isDark);
      root.style.colorScheme = isDark ? "dark" : "light";
    };

    applyTheme();

    if (theme !== "system") return;

    mediaQuery.addEventListener("change", applyTheme);

    localStorage.setItem("theme", theme);

    return () => {
      mediaQuery.removeEventListener("change", applyTheme);
    };
  }, [theme]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors />
    </>
  );
}

export default App;

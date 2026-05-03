import { useEffect } from "react";
import { useProfiles } from "@/hooks/useProfile";

export function ThemeProvider() {
  const { data: profiles = [] } = useProfiles();
  const profile = profiles[0];

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Aplica classe de tema claro/escuro
    if (profile?.theme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
      root.classList.remove("light");
    }

    // Aplica cor customizada quando configurada
    if (profile?.primary_color) {
      root.style.setProperty("--primary", profile.primary_color);
      root.style.setProperty("--ring", profile.primary_color);
      root.style.setProperty("--accent", profile.primary_color);
    } else {
      // Verde padrão
      root.style.removeProperty("--primary");
      root.style.removeProperty("--ring");
      root.style.removeProperty("--accent");
    }
  }, [profile?.theme, profile?.primary_color]);

  return null;
}

import { useEffect } from "react";
import { useProfiles } from "@/hooks/useProfile";

/**
 * Atualiza dinamicamente o favicon com base em favicon_url do perfil.
 * Usa `/favicon.png` quando não há favicon customizado.
 */
const useDynamicFavicon = () => {
  const { data: profiles = [] } = useProfiles();
  const profile = profiles[0];

  useEffect(() => {
    const faviconUrl = profile?.favicon_url;
    if (!faviconUrl) return;

    // Atualiza todos os elementos de favicon
    const linkElements = document.querySelectorAll<HTMLLinkElement>(
      'link[rel="icon"], link[rel="shortcut icon"]'
    );

    if (linkElements.length > 0) {
      linkElements.forEach((link) => {
        link.href = faviconUrl;
        // Detecta o tipo a partir da URL
        if (faviconUrl.endsWith(".svg")) {
          link.type = "image/svg+xml";
        } else if (faviconUrl.endsWith(".ico")) {
          link.type = "image/x-icon";
        } else {
          link.type = "image/png";
        }
      });
    } else {
      // Cria o link do favicon quando ele não existe
      const link = document.createElement("link");
      link.rel = "icon";
      link.href = faviconUrl;
      link.type = faviconUrl.endsWith(".svg")
        ? "image/svg+xml"
        : faviconUrl.endsWith(".ico")
          ? "image/x-icon"
          : "image/png";
      document.head.appendChild(link);
    }
  }, [profile?.favicon_url]);
};

export default useDynamicFavicon;

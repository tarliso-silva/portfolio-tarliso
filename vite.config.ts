import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // Resolve OG image URL at build time: use env var or fall back to favicon
    {
      name: "html-og-image",
      transformIndexHtml(html: string) {
        const ogUrl = process.env.VITE_OG_IMAGE_URL || "/favicon.png";
        return html.replace(/%VITE_OG_IMAGE_URL%/g, ogUrl);
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

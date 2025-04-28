import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import autoImport from "unplugin-auto-import/vite";
import unocss from "unocss/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    unocss(),
    autoImport({
      dts: "./src/auto-imports.d.ts",
      imports: ["react", "ahooks", "react-router", "react-router-dom"],
    }),
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    port: 3000,
    open: false,
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});

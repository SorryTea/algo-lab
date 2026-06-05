import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "https://localhost:7027", // было http://localhost:5192
        changeOrigin: true,
        secure: false, // не проверять самоподписанный dev-сертификат
      },
    },
  },
});
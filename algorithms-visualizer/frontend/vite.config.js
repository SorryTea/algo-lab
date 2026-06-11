import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const backend = {
  target: "https://localhost:7027",
  changeOrigin: true,
  secure: false,
};

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": backend,
      "/Identity": backend,
      "/Admin": backend,
      "/lib": backend,
      "/css": backend,
      "/js": backend,
      "/uploads": backend,
      "/algorithms_visualizer.styles.css": backend,
    },
  },
});
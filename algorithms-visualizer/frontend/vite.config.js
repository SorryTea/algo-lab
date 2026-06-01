import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5192", // < HTTP i port 5192
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

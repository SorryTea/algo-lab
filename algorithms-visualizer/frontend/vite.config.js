import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const backend = {
  target: "https://localhost:7027",
  changeOrigin: true,
  secure: false,
};

export default defineConfig({
  plugins: [react()],
   build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "react-vendor",
              test: /node_modules[\\/](react|react-dom|react-router|scheduler)[\\/]/,
            },
            {
              name: "motion",
              test: /node_modules[\\/](motion|framer-motion)[\\/]/,
            },
            {
              name: "vendor",
              test: /node_modules[\\/]/,
            },
          ],
        },
      },
    },
  },
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
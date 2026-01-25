import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: parseInt(process.env.VITE_API_URL, 10), //port-3000
    proxy: {
      "/api": "http://localhost:4000",
    },
  },
});

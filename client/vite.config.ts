import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"; // <-- needed for resolving paths

// Force IPv4 instead of IPv6 - Firewall blocking it
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@api": path.resolve(__dirname, "src/api"),
      "@models": path.resolve(__dirname, "src/types"),
      "@components": path.resolve(__dirname, "src/components"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@context": path.resolve(__dirname, "src/context"),
      "@theme": path.resolve(__dirname, "src/theme"),
      "@assets": path.resolve(__dirname, "src/assets"),
    },
  },
  server: {
    host: "127.0.0.1",
    port: 5173, // frontend port
    strictPort: false, // allows fallback if 5173 is taken

    // Proxy API calls to backend
    proxy: {
      "/users": {
        target: "http://localhost:3002/api/",
        changeOrigin: true,
        secure: false,
      },
      "/shelters": {
        target: "http://localhost:3002/api/",
        changeOrigin: true,
        secure: false,
      },
      "/counties": {
        target: "http://localhost:3002/api/",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Force IPv4 instead of IPv6 - Firewall blocking it
export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 5173,        // you can change this if needed
    strictPort: false // allows fallback like 5174 if 5173 is taken
  }
})

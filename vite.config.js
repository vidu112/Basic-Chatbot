import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from "url";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  resolve: {
    alias: {
      // “@” → <project-root>/src
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // “context” → <project-root>/src/context
      "context": fileURLToPath(new URL("./src/context", import.meta.url)),
      // “api” → <project-root>/src/api.js
      "api": fileURLToPath(new URL("./src/api.js", import.meta.url)),
      // optionally, “components” → <project-root>/src/components
      "components": fileURLToPath(new URL("./src/components", import.meta.url))
    }
  }
})

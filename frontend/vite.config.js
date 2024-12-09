import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env.REACT_APP_BACKEND_URL": JSON.stringify(process.env.REACT_APP_BACKEND_URL),
  },
  build: {
    outDir: "build", // Matches the directory expected by your Dockerfile
    emptyOutDir: true, // Clears the output directory before building
  },
  server: {
    port: 3000, // Ensures the dev server uses the same port as your Docker config
  },
})

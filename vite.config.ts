import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // This is the key change to fix the runtime error.
  // It replaces `process.env.API_KEY` with the actual value from the build environment.
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
})

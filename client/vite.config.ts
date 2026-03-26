import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
const isDebug = process.env.VITE_DEBUG === 'true';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  ...(isDebug && {
    root: '.',
    build: { rollupOptions: { input: './debug.html' } },
    server: { open: '/debug.html' },
  }),
})

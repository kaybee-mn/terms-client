import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js', // Make sure this points to your PostCSS config
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
})

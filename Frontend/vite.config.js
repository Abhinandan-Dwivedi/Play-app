import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  darkMode: 'class', 
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  server: {
    // proxy: {
    //   '/api': {
    //     target: 'https://play-video.onrender.com',
    //     changeOrigin: true,
    //     secure: false
    //   }
    // }
  },
  theme: {
    extend: {},
  },
  plugins: [ tailwindcss(), react()],
})

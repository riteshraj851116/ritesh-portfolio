import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.GH_PAGES ? '/ritesh-portfolio/' : '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('three') || id.includes('@react-three')) {
            return 'vendor_three';
          }
          if (id.includes('gsap') || id.includes('lenis')) {
            return 'vendor_motion';
          }
        },
      },
    },
  },
})
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['offline.html'],
      manifest: {
        name: 'Restaurant POS',
        short_name: 'POS',
        description: 'Production-ready restaurant POS',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        icons: []
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        navigateFallback: '/offline.html'
      }
    })
  ]
});

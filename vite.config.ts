import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Vanilla Toolkit',
        short_name: 'Toolkit',
        theme_color: '#6366f1',
        icons: [
          { src: '/manifest-icons/icon-256.png', sizes: '256x256', type: 'image/png' },
          {
            src: '/manifest-icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
});

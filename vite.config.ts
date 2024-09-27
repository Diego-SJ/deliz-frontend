import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import { VitePWA } from 'vite-plugin-pwa';

import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // build: {
  //   rollupOptions: {
  //     output: {
  //       manualChunks(id) {
  //         if (id.includes('node_modules')) {
  //           return id.toString().split('node_modules/')[1].split('/')[0].toString();
  //         }
  //       },
  //     },
  //   },
  // },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    react(),
    // VitePWA({
    //   workbox: {
    //     maximumFileSizeToCacheInBytes: 4000000, // Establece el límite a 4 MiB
    //   },
    //   registerType: 'autoUpdate',
    //   includeAssets: [
    //     'logo.svg',
    //     'favicon.ico',
    //     // 'apple-touch-icon-180x180.png',
    //     'maskable_icon-512x512.png',
    //     'pwa-64x64.png',
    //     'pwa-192x192.png',
    //     'pwa-512x512.png',
    //   ],
    //   manifest: {
    //     name: 'Punto de venta',
    //     short_name: 'POS App',
    //     description: 'Aplicación de punto de venta con React 18',
    //     theme_color: '#ffffff',
    //     display: 'standalone',
    //     scope: '/',
    //     start_url: '/',
    //     orientation: 'portrait',
    //     background_color: '#ffffff',
    //     icons: [
    //       {
    //         src: '/public/logo.svg',
    //         sizes: '192x192',
    //         type: 'image/svg',
    //       },
    //       {
    //         src: '/public/favicon.ico',
    //         sizes: '192x192',
    //       },
    //       {
    //         src: '/public/apple-touch-icon-180x180.png',
    //         sizes: '180x180',
    //         type: 'image/png',
    //       },
    //       {
    //         src: '/public/maskable_icon-512x512.png',
    //         sizes: '512x512',
    //         purpose: 'maskable',
    //       },
    //       {
    //         src: '/public/pwa-64x64.png',
    //         sizes: '64x64',
    //       },
    //       {
    //         src: '/public/pwa-192x192.png',
    //         sizes: '192x192',
    //       },
    //       {
    //         src: '/public/pwa-512x512.png',
    //         sizes: '512x512',
    //       },
    //     ],
    //   },
    // }),
  ],
  server: {
    host: true,
  },
});

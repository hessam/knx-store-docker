import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
// SSR adapter intentionally not used on this branch

export default defineConfig({
  output: 'static',
  adapter: undefined,

  integrations: [
    tailwind()
  ],

  vite: {
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    },
    // Performance optimizations
    build: {
      minify: 'terser',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['astro']
          }
        }
      }
    },
    // Optimize CSS
    css: {
      devSourcemap: false
    }
  },

  // SEO and Performance
  site: 'https://knx-store-docker.vercel.app'
});
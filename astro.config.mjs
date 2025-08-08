import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  
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
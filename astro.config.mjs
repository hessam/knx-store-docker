import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://your-knx-store.vercel.app',
  integrations: [
    tailwind({
      config: { path: './tailwind.config.mjs' }
    }),
    sitemap({
      filter: (page) => !page.includes('/api/')
    }),
    react(),
    mdx()
  ],
  output: 'static', // Static site generation for development
  server: {
    host: '0.0.0.0',
    port: 4001
  },
  vite: {
    server: {
      watch: {
        usePolling: true // For Docker development
      }
    },
    optimizeDeps: {
      include: ['@stripe/stripe-js']
    }
  },
  build: {
    inlineStylesheets: 'auto'
  },
  compressHTML: true
}); 
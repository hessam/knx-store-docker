import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';
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
  output: 'hybrid', // Enable both static and server-side rendering
  adapter: vercel({
    analytics: true,
    speedInsights: true,
    webAnalytics: {
      enabled: true
    }
  }),
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
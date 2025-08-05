import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'static',
  adapter: undefined,
  
  integrations: [
    tailwind()
  ],
  
  vite: {
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }
  },

  // SEO and Performance
  site: 'https://knx-store.vercel.app'
}); 
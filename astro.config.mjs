import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';
import node from '@astrojs/node';

const isPreview = process.env.NODE_ENV === 'preview';
const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  output: isPreview ? 'static' : 'server',
  adapter: isPreview ? undefined : vercel({
    webAnalytics: { enabled: true }
  }),
  
  // Enhanced configuration for different environments
  build: {
    inlineStylesheets: isProduction ? 'auto' : 'never',
  },
  
  vite: {
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: isProduction ? {
            vendor: ['react', 'react-dom'],
            utils: ['lodash', 'date-fns']
          } : undefined
        }
      }
    }
  },

  // Preview-specific configuration
  preview: {
    host: isPreview ? '0.0.0.0' : undefined,
    port: isPreview ? 4001 : undefined
  },

  // SEO and Performance
  site: 'https://your-domain.vercel.app',
  
  // Enhanced error handling
  experimental: {
    serverIslands: false // Disable if causing issues
  }
}); 
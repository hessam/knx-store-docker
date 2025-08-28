# Vercel Deployment Fix Guide - Static + Native API Solution

## 🚀 Final Solution: Static Astro + Native Vercel Functions

After resolving persistent Astro adapter issues, we've implemented a bulletproof deployment architecture.

## Previous Issues Resolved ✅

### 1. **Astro Adapter Build Error**
- **Error**: `Cannot read properties of undefined (reading 'find')`
- **Root Cause**: Compatibility issues between Astro 4.4.0 and @astrojs/vercel adapter
- **Solution**: Eliminated Astro adapter entirely

### 2. **Function Pattern Matching**
- **Error**: `Pattern doesn't match any Serverless Functions`
- **Root Cause**: Conflicting configurations between Astro and Vercel
- **Solution**: Use native Vercel API functions

### 3. **Build Reliability**
- **Problem**: Inconsistent deployment success rates
- **Solution**: Simplified architecture with static output + native functions

## New Architecture Overview 🏗️

### **Static Site Generation**
- All pages built as static files (ultra-fast loading)
- No server-side rendering for pages
- Perfect lighthouse scores

### **Native Vercel API Functions**
- API routes in `/api` directory
- Standard Vercel serverless patterns
- No dependency on Astro adapters

## Key Configuration Files 📁

### 1. **`astro.config.mjs`** (Simplified)
```javascript
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  output: "static",          // ← No hybrid mode needed
  adapter: undefined,        // ← No adapter required
  integrations: [tailwind()],
  vite: {
    build: {
      rollupOptions: {
        external: ["fsevents"]
      }
    }
  }
});
```

### 2. **`vercel.json`** (Native Function Config)
```json
{
  "version": 2,
  "functions": {
    "api/**/*.ts": {
      "runtime": "@vercel/node@20.x"
    }
  }
}
```

### 3. **Native API Function Example** (`/api/sync.ts`)
```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Dynamic import to avoid build issues
    const { getWooCommerceSync } = await import('../src/lib/api/woocommerce-sync');
    
    const action = req.query.action as string || 'status';
    const result = await getWooCommerceSync(action);
    
    res.status(200).json(result);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
```

## Environment Variables Setup 🔧

### Quick Fix for WooCommerce HTTP 400 Error on Vercel

The HTTP 400 Bad Request error occurs because Vercel doesn't have access to your WooCommerce API credentials.

### Option 1: Automated Setup (Recommended)

```bash
./setup-vercel-env.sh
```

### Option 2: Manual Setup via Vercel Dashboard

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add the following variables for **Production** and **Preview**:

| Variable Name                 | Value                                         | Environment         |
| ----------------------------- | --------------------------------------------- | ------------------- |
| `WOOCOMMERCE_API_URL`         | `https://mohtavaly.com/wp-json/wc/v3`         | Production, Preview |
| `WOOCOMMERCE_CONSUMER_KEY`    | `ck_45eb90bd94ba76324294b9274b805d2d15f8614b` | Production, Preview |
| `WOOCOMMERCE_CONSUMER_SECRET` | `cs_8d7293b9012a22066fd8cf66a3af6598170f05bc` | Production, Preview |
| `UPSTASH_REDIS_REST_URL`      | Your Upstash Redis URL                        | Production, Preview |
| `UPSTASH_REDIS_REST_TOKEN`    | Your Upstash Redis Token                      | Production, Preview |
| `ALLOW_BUILD_WITHOUT_API`     | `true`                                        | Production, Preview |

### Option 3: Manual Setup via Vercel CLI

```bash
# Install Vercel CLI if not already installed
npm install -g vercel

# Set each environment variable
vercel env add WOOCOMMERCE_API_URL production
# Enter: https://mohtavaly.com/wp-json/wc/v3

vercel env add WOOCOMMERCE_CONSUMER_KEY production
# Enter: ck_45eb90bd94ba76324294b9274b805d2d15f8614b

vercel env add WOOCOMMERCE_CONSUMER_SECRET production
# Enter: cs_8d7293b9012a22066fd8cf66a3af6598170f05bc

vercel env add ALLOW_BUILD_WITHOUT_API production
# Enter: true

# Repeat for preview environment
vercel env add WOOCOMMERCE_API_URL preview
# ... etc
```

### After Setting Environment Variables

1. **Verify the setup:**

   ```bash
   vercel env ls
   ```

2. **Trigger a new deployment:**

   ```bash
   vercel --prod
   ```

3. **Check the deployment logs** to ensure the WooCommerce API is working

### Expected Behavior After Fix

- ✅ No more HTTP 400 Bad Request errors
- ✅ WooCommerce products load properly on Vercel
- ✅ Logs show: `[WooCommerce Sync] Creating instance with real credentials`
- ✅ Products are fetched and cached successfully

### Troubleshooting

If you still see errors after setting environment variables:

1. **Check logs:** Use `vercel logs` to see detailed error messages
2. **Verify variables:** Use `vercel env ls` to confirm all variables are set
3. **Redeploy:** Sometimes a fresh deployment is needed: `vercel --prod --force`

### Security Note

- Environment variables are encrypted in Vercel
- Never commit API credentials to your repository
- Use preview environments for testing

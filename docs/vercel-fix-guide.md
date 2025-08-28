# Vercel Environment Variables Setup Guide

## Quick Fix for WooCommerce HTTP 400 Error on Vercel

The HTTP 400 Bad Request error occurs because Vercel doesn't have access to your WooCommerce API credentials.

### Option 1: Automated Setup (Recommended)

Run the setup script:

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

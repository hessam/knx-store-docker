# 🔧 **Vercel Environment Variables Setup Guide**

## 📋 **Overview**

This guide explains how to configure environment variables in Vercel for the WooCommerce sync functionality to work in production.

## 🚨 **Current Issue**

The WooCommerce sync is working locally but failing in Vercel because:
- Local development has access to `.env` file
- Vercel production doesn't have environment variables configured
- API credentials are missing in production

## 🚀 **Quick Setup**

### **1. Access Vercel Dashboard**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `knx-store-docker` project
3. Navigate to **Settings** → **Environment Variables**

### **2. Add Required Environment Variables**

Add the following environment variables:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `WOOCOMMERCE_API_URL` | `https://mohtavaly.com/wp-json/wc/v3` | Production, Preview, Development |
| `WOOCOMMERCE_CONSUMER_KEY` | `ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` | Production, Preview, Development |
| `WOOCOMMERCE_CONSUMER_SECRET` | `cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` | Production, Preview, Development |
| `REDIS_HOST` | `localhost` | Production, Preview, Development |
| `REDIS_PORT` | `6379` | Production, Preview, Development |
| `REDIS_PASSWORD` | `your_redis_password` (optional) | Production, Preview, Development |
| `GTM_ID` | `GTM-XXXXXXX` | Production, Preview, Development |

### **3. Environment Selection**

For each variable, select:
- ✅ **Production** - Live site
- ✅ **Preview** - Preview deployments
- ✅ **Development** - Local development (optional)

### **4. Redeploy**

After adding environment variables:
1. Go to **Deployments** tab
2. Find your latest deployment
3. Click **Redeploy** (three dots menu)

## 🔍 **Verification Steps**

### **1. Check Environment Variables**

In Vercel dashboard:
- Go to **Settings** → **Environment Variables**
- Verify all variables are listed
- Check that they're enabled for the correct environments

### **2. Test Sync Functionality**

After redeployment, test:
- Visit `/products/test` - Should show real products
- Visit `/sync-test` - Should show successful sync status
- Check browser console for any remaining errors

### **3. Monitor Logs**

In Vercel dashboard:
- Go to **Functions** tab
- Check for any API route errors
- Monitor `/api/sync` endpoint logs

## 🛠️ **Alternative: Use Vercel CLI**

If you prefer command line:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Add environment variables
vercel env add WOOCOMMERCE_API_URL
vercel env add WOOCOMMERCE_CONSUMER_KEY
vercel env add WOOCOMMERCE_CONSUMER_SECRET
vercel env add REDIS_HOST
vercel env add REDIS_PORT
vercel env add REDIS_PASSWORD
vercel env add GTM_ID

# Redeploy
vercel --prod
```

## 🔒 **Security Best Practices**

1. **Never commit credentials** to version control
2. **Use different keys** for development and production
3. **Rotate keys** periodically
4. **Limit API permissions** to minimum required

## 📊 **Expected Results**

After configuration:

### **✅ Success Indicators**
- `/products/test` shows real WooCommerce products
- `/sync-test` shows successful sync status
- No "credentials not configured" errors
- Images load properly (fix placeholder.com issue)

### **❌ Common Issues**
- Environment variables not set for correct environments
- Wrong API credentials
- Network connectivity issues
- Redis connection failures (expected in production)

## 🔧 **Image Loading Fix**

The placeholder.com error can be fixed by:

1. **Use a different placeholder service**:
   ```typescript
   // In woocommerce-sync.ts fallback products
   const fallbackImage = "https://picsum.photos/400/400?random=1";
   ```

2. **Or use local placeholder images**:
   ```typescript
   const fallbackImage = "/images/placeholder-product.jpg";
   ```

## 📞 **Support**

If issues persist:
1. Check Vercel deployment logs
2. Verify environment variables are set correctly
3. Test API credentials manually
4. Check WooCommerce API access

---

**Status**: ✅ **Ready for Setup**  
**Last Updated**: [Current Date]  
**Version**: 1.0 
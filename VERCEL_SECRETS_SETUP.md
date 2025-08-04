# 🔑 Vercel Secrets Setup Guide

## ❌ Current Issue:
The GitHub Actions workflow is failing because it's missing the required `VERCEL_TOKEN` secret.

## ✅ Required Secrets:

### **1. VERCEL_TOKEN (Required)**
**How to get it:**
1. Go to [Vercel Dashboard](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Name: `GitHub Actions - KNX Store`
4. Copy the generated token

### **2. VERCEL_ORG_ID (Recommended)**
**How to get it:**
1. Go to your Vercel project settings
2. Look for "Organization ID" in the project settings
3. Or run: `vercel whoami` in your terminal

### **3. VERCEL_PROJECT_ID (Recommended)**
**How to get it:**
1. Go to your Vercel project settings
2. Look for "Project ID" in the project settings
3. Or check `.vercel/project.json` after running `vercel link`

## 🔧 How to Add Secrets to GitHub:

### **Step 1: Go to Repository Settings**
1. Navigate to your GitHub repository
2. Click "Settings" tab
3. Click "Secrets and variables" → "Actions"

### **Step 2: Add Each Secret**
1. Click "New repository secret"
2. Add each secret:

```
Name: VERCEL_TOKEN
Value: [your-vercel-token]

Name: VERCEL_ORG_ID  
Value: [your-org-id]

Name: VERCEL_PROJECT_ID
Value: [your-project-id]
```

### **Step 3: Verify Secrets**
- Go to "Actions" → "Secrets and variables" → "Actions"
- You should see all three secrets listed

## 🚀 Alternative: Quick Setup with Vercel CLI

If you have Vercel CLI installed:

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Get your credentials
vercel whoami
cat .vercel/project.json
```

## 📋 Complete Secret List:

For full functionality, add these secrets:

### **Required for Deployment:**
- `VERCEL_TOKEN` - Your Vercel API token
- `VERCEL_ORG_ID` - Your Vercel organization ID  
- `VERCEL_PROJECT_ID` - Your Vercel project ID

### **Optional for Full Features:**
- `WORDPRESS_API_URL` - WordPress API URL
- `WOOCOMMERCE_CONSUMER_KEY` - WooCommerce consumer key
- `WOOCOMMERCE_CONSUMER_SECRET` - WooCommerce consumer secret
- `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `SENDGRID_API_KEY` - SendGrid API key
- `GOOGLE_API_KEY` - Google API key
- `GOOGLE_SHEET_ID` - Google Sheet ID
- `GTM_ID` - Google Tag Manager ID

## 🔍 Verification:

After adding secrets:
1. **Check GitHub Actions**: Go to Actions tab
2. **Trigger a new run**: Push a commit or manually trigger
3. **Check logs**: Look for successful Vercel deployment
4. **Verify preview**: Check if preview URL is generated

## 🛠️ Troubleshooting:

### **If deployment still fails:**
1. Verify all secrets are correctly added
2. Check Vercel token has proper permissions
3. Ensure Vercel project is properly linked
4. Check GitHub Actions logs for specific errors

### **Common Issues:**
- **"Invalid token"**: Regenerate Vercel token
- **"Project not found"**: Check VERCEL_PROJECT_ID
- **"Organization not found"**: Check VERCEL_ORG_ID

## 📊 Expected Results:

After adding the secrets:
- ✅ **GitHub Actions** should run successfully
- ✅ **Vercel deployment** should complete
- ✅ **Preview URL** should be generated
- ✅ **PR comments** should include preview link

**Add these secrets and the preview deployment should work!** 🎯 
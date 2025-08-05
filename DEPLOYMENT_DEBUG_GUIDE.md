# 🚨 Deployment Debug Guide

## ❌ Current Issue: Deployment Failing

The deployment is failing because the GitHub Actions workflows are trying to use secrets that haven't been added yet.

## 🔑 Required Secrets (Priority Order)

### **✅ Already Added (Essential)**
- `VERCEL_TOKEN` ✅
- `VERCEL_ORG_ID` ✅  
- `VERCEL_PROJECT_ID` ✅

### **⚠️ Missing (Optional but Referenced in Workflows)**

#### **1. Code Coverage (Optional)**
- `CODECOV_TOKEN` - For test coverage reporting

#### **2. WordPress & WooCommerce (Optional)**
- `WORDPRESS_API_URL` - WordPress REST API endpoint
- `WOOCOMMERCE_CONSUMER_KEY` - WooCommerce API key
- `WOOCOMMERCE_CONSUMER_SECRET` - WooCommerce API secret

#### **3. Payment Processing (Optional)**
- `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `STRIPE_SECRET_KEY` - Stripe secret key

#### **4. Communication (Optional)**
- `SENDGRID_API_KEY` - SendGrid email API key
- `GOOGLE_API_KEY` - Google API key for sheets
- `GOOGLE_SHEET_ID` - Google Sheets ID

#### **5. Analytics (Optional)**
- `GTM_ID` - Google Tag Manager ID

## 🚀 Quick Fix: Simplify Workflow

The current workflows are trying to use all these optional secrets. Let's create a simplified workflow that only requires the essential Vercel secrets.

### **Option 1: Add Missing Secrets (Recommended)**
Add these placeholder values to GitHub secrets:

```bash
# Go to GitHub: Settings → Secrets and variables → Actions
# Add these secrets with placeholder values:

CODECOV_TOKEN=placeholder
WORDPRESS_API_URL=https://placeholder.com/wp-json
WOOCOMMERCE_CONSUMER_KEY=placeholder
WOOCOMMERCE_CONSUMER_SECRET=placeholder
STRIPE_PUBLISHABLE_KEY=pk_test_placeholder
STRIPE_SECRET_KEY=sk_test_placeholder
SENDGRID_API_KEY=placeholder
GOOGLE_API_KEY=placeholder
GOOGLE_SHEET_ID=placeholder
GTM_ID=GTM-PLACEHOLDER
```

### **Option 2: Modify Workflow (Alternative)**
Remove the optional secrets from the workflow files.

## 🔍 Debug Steps

### **1. Check GitHub Actions Logs**
1. Go to your GitHub repository
2. Click **Actions** tab
3. Click on the failed workflow run
4. Look for specific error messages

### **2. Check Vercel Dashboard**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Check if the project is properly linked
3. Look for deployment logs

### **3. Test Locally**
```bash
# Test build locally
docker exec knx-store-dev sh -c "cd /app && npm run build"

# Test deployment locally
docker exec knx-store-dev sh -c "cd /app && npx vercel --prod"
```

## 📋 Immediate Action Plan

### **Step 1: Add Placeholder Secrets**
Add all the missing secrets with placeholder values to prevent workflow failures.

### **Step 2: Test Deployment**
Make a small change and push to trigger the workflow:
```bash
echo "# Test deployment" >> README.md
git add README.md
git commit -m "test: Trigger deployment test"
git push origin test-preview-deployment
```

### **Step 3: Monitor Results**
1. Check GitHub Actions tab
2. Look for successful deployment
3. Check Vercel dashboard for preview URL

### **Step 4: Verify Deployment**
1. Visit the preview URL
2. Test the debug pages: `/debug` and `/test`
3. Check if all functionality works

## 🎯 Expected Results

After adding the placeholder secrets:
- ✅ **GitHub Actions**: Should run without errors
- ✅ **Vercel Deployment**: Should deploy successfully
- ✅ **Preview URL**: Should be generated
- ✅ **Debug Pages**: Should be accessible

## 🚨 Common Issues

### **Issue 1: Missing Secrets**
**Error**: `Secret 'SECRET_NAME' not found`
**Solution**: Add the missing secret to GitHub repository settings

### **Issue 2: Vercel Authentication**
**Error**: `Vercel authentication failed`
**Solution**: Verify `VERCEL_TOKEN` is correct and has proper permissions

### **Issue 3: Build Failures**
**Error**: `Build failed`
**Solution**: Check build logs for specific errors

### **Issue 4: Project Not Found**
**Error**: `Project not found`
**Solution**: Verify `VERCEL_PROJECT_ID` is correct

## 📞 Next Steps

1. **Add placeholder secrets** to GitHub repository
2. **Test deployment** with a simple commit
3. **Monitor results** in GitHub Actions and Vercel
4. **Report back** with any specific error messages

**The deployment should work once all the referenced secrets are added, even with placeholder values!** 🚀 
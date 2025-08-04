# 🔐 Complete GitHub Secrets Setup Guide for KNX Store

## 📋 Required Secrets Summary

Based on the GitHub Actions workflows, you need to add these secrets to your repository:

### **🔑 Essential Secrets (Required for Deployment)**

| Secret Name | Status | Description |
|-------------|--------|-------------|
| `VERCEL_TOKEN` | ✅ **ADDED** | Vercel authentication token |
| `VERCEL_ORG_ID` | ⚠️ **NEEDED** | Vercel organization ID |
| `VERCEL_PROJECT_ID` | ⚠️ **NEEDED** | Vercel project ID |

### **🌐 WordPress & WooCommerce Secrets (Required for Data)**

| Secret Name | Status | Description |
|-------------|--------|-------------|
| `WORDPRESS_API_URL` | ⚠️ **NEEDED** | WordPress REST API URL |
| `WOOCOMMERCE_CONSUMER_KEY` | ⚠️ **NEEDED** | WooCommerce API consumer key |
| `WOOCOMMERCE_CONSUMER_SECRET` | ⚠️ **NEEDED** | WooCommerce API consumer secret |

### **💳 Payment & E-commerce Secrets (Required for Transactions)**

| Secret Name | Status | Description |
|-------------|--------|-------------|
| `STRIPE_PUBLISHABLE_KEY` | ⚠️ **NEEDED** | Stripe publishable key |
| `STRIPE_SECRET_KEY` | ⚠️ **NEEDED** | Stripe secret key |

### **📧 Communication Secrets (Required for Notifications)**

| Secret Name | Status | Description |
|-------------|--------|-------------|
| `SENDGRID_API_KEY` | ⚠️ **NEEDED** | SendGrid API key for emails |
| `GOOGLE_API_KEY` | ⚠️ **NEEDED** | Google API key for sheets |
| `GOOGLE_SHEET_ID` | ⚠️ **NEEDED** | Google Sheets ID for logging |

### **📊 Analytics Secrets (Required for Tracking)**

| Secret Name | Status | Description |
|-------------|--------|-------------|
| `GTM_ID` | ⚠️ **NEEDED** | Google Tag Manager ID |

## 🚀 How to Add Secrets

### **Step 1: Go to GitHub Repository Settings**
1. Navigate to your repository: `https://github.com/hessam/knx-store-docker`
2. Click **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**

### **Step 2: Add Each Secret**
1. Click **New repository secret**
2. Enter the **Name** (exactly as shown above)
3. Enter the **Value** (your actual secret)
4. Click **Add secret**

## 🔍 How to Get Each Secret

### **1. Vercel Secrets (Already have VERCEL_TOKEN)**

#### **VERCEL_ORG_ID**
```bash
# Method 1: Vercel CLI
vercel whoami

# Method 2: Vercel Dashboard
# Go to https://vercel.com/dashboard
# Look for "Organization ID" in project settings
```

#### **VERCEL_PROJECT_ID**
```bash
# Method 1: Vercel CLI
vercel link
# Check .vercel/project.json file

# Method 2: Vercel Dashboard
# Go to your project settings
# Look for "Project ID"
```

### **2. WordPress & WooCommerce Secrets**

#### **WORDPRESS_API_URL**
```
https://your-wordpress-site.com/wp-json/wp/v2/
```

#### **WOOCOMMERCE_CONSUMER_KEY & WOOCOMMERCE_CONSUMER_SECRET**
1. Go to your WordPress admin
2. Navigate to **WooCommerce** → **Settings** → **Advanced** → **REST API**
3. Click **Add key**
4. Set permissions to **Read/Write**
5. Copy the **Consumer Key** and **Consumer Secret**

### **3. Stripe Secrets**

#### **STRIPE_PUBLISHABLE_KEY & STRIPE_SECRET_KEY**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Developers** → **API keys**
3. Copy **Publishable key** and **Secret key**
4. Use **Test keys** for development

### **4. SendGrid Secret**

#### **SENDGRID_API_KEY**
1. Go to [SendGrid Dashboard](https://app.sendgrid.com/)
2. Navigate to **Settings** → **API Keys**
3. Create a new API key with **Full Access** or **Restricted Access** (Mail Send)
4. Copy the generated API key

### **5. Google Secrets**

#### **GOOGLE_API_KEY**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google Sheets API**
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy the API key

#### **GOOGLE_SHEET_ID**
1. Create a new Google Sheet
2. Copy the ID from the URL: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit`
3. Share the sheet with your Google service account

### **6. Google Tag Manager Secret**

#### **GTM_ID**
1. Go to [Google Tag Manager](https://tagmanager.google.com/)
2. Create a new account/container or use existing
3. Copy the **Container ID** (format: GTM-XXXXXXX)

## 📝 Quick Setup Checklist

### **Phase 1: Essential (Deployment)**
- [x] `VERCEL_TOKEN` ✅ **DONE**
- [ ] `VERCEL_ORG_ID` 
- [ ] `VERCEL_PROJECT_ID`

### **Phase 2: Data (WordPress)**
- [ ] `WORDPRESS_API_URL`
- [ ] `WOOCOMMERCE_CONSUMER_KEY`
- [ ] `WOOCOMMERCE_CONSUMER_SECRET`

### **Phase 3: Payments (Stripe)**
- [ ] `STRIPE_PUBLISHABLE_KEY`
- [ ] `STRIPE_SECRET_KEY`

### **Phase 4: Communication (Email/Sheets)**
- [ ] `SENDGRID_API_KEY`
- [ ] `GOOGLE_API_KEY`
- [ ] `GOOGLE_SHEET_ID`

### **Phase 5: Analytics (GTM)**
- [ ] `GTM_ID`

## 🚨 Priority Order

1. **HIGH**: `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` (for deployment)
2. **MEDIUM**: WordPress/WooCommerce secrets (for data)
3. **LOW**: Stripe, SendGrid, Google, GTM (for full functionality)

## 🔧 Testing Secrets

After adding secrets, you can test them:

```bash
# Test Vercel deployment
git push origin test-preview-deployment

# Check GitHub Actions logs
# Go to Actions tab → Preview Deployment workflow
```

## 📊 Current Status

- **Deployment**: ⚠️ Needs Vercel org/project IDs
- **Data**: ⚠️ Needs WordPress/WooCommerce credentials
- **Payments**: ⚠️ Needs Stripe credentials
- **Communication**: ⚠️ Needs SendGrid/Google credentials
- **Analytics**: ⚠️ Needs GTM ID

## 🎯 Next Steps

1. **Add Vercel org/project IDs** (highest priority)
2. **Test deployment** with minimal secrets
3. **Add WordPress/WooCommerce** secrets
4. **Add remaining secrets** as needed

**Start with the Vercel secrets to get deployment working!** 🚀 
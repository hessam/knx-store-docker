# 🔑 Getting Vercel Credentials for Preview Deployments

## Step 1: Install Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Or using yarn
yarn global add vercel
```

## Step 2: Login to Vercel

```bash
# Login to your Vercel account
vercel login
```

## Step 3: Link Your Project

```bash
# Navigate to your project directory
cd /path/to/knx-store-docker

# Link to Vercel (this will create a new project)
vercel link
```

## Step 4: Get Required Credentials

After linking, you'll need these three values for GitHub secrets:

### 1. Vercel Token
```bash
# Generate a new token
vercel token create "KNX Store Preview Deployments"
```

### 2. Organization ID
```bash
# Get your organization ID
vercel whoami
```

### 3. Project ID
```bash
# Get project ID (found in .vercel/project.json after linking)
cat .vercel/project.json
```

## Step 5: Add to GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:
- `VERCEL_TOKEN` = [token from step 1]
- `VERCEL_ORG_ID` = [org ID from step 2]
- `VERCEL_PROJECT_ID` = [project ID from step 3]

## Alternative: Manual Setup

If you prefer to set up manually:

1. **Create Vercel Project**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure build settings:
     - Framework Preset: Astro
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`

2. **Get Credentials**:
   - **Token**: Go to Account Settings → Tokens → Create
   - **Org ID**: Found in your account settings
   - **Project ID**: Found in project settings

## Test Configuration

```bash
# Test if Vercel CLI is working
vercel --version

# Test deployment (optional)
vercel --prod
```

## Troubleshooting

### Common Issues:
1. **"Not linked to a project"**: Run `vercel link` first
2. **"Invalid token"**: Generate a new token
3. **"Project not found"**: Check project ID in Vercel dashboard
4. **"Build failed"**: Check build logs in Vercel dashboard

### Verify Setup:
```bash
# Check if project is linked
vercel ls

# Check project info
vercel project ls
``` 
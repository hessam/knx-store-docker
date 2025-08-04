# 🚀 GitHub Repository Setup & Preview Deployment Test

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it: `knx-store-docker`
3. Make it **Public** (for easier testing)
4. **Don't** initialize with README, .gitignore, or license (we already have these)

## Step 2: Add GitHub Remote

```bash
# Add the GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/knx-store-docker.git

# Push the main branch
git push -u origin main

# Push the test branch
git push -u origin test-preview-deployment
```

## Step 3: Configure GitHub Secrets

In your GitHub repository settings, add these secrets:

### Required Secrets for Preview Deployments:
- `VERCEL_TOKEN` - Your Vercel API token
- `VERCEL_ORG_ID` - Your Vercel organization ID
- `VERCEL_PROJECT_ID` - Your Vercel project ID

### Optional Secrets (for full functionality):
- `WORDPRESS_API_URL` - WordPress API URL
- `WOOCOMMERCE_CONSUMER_KEY` - WooCommerce consumer key
- `WOOCOMMERCE_CONSUMER_SECRET` - WooCommerce consumer secret
- `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `SENDGRID_API_KEY` - SendGrid API key
- `GOOGLE_API_KEY` - Google API key
- `GOOGLE_SHEET_ID` - Google Sheet ID
- `GTM_ID` - Google Tag Manager ID

## Step 4: Create Pull Request

1. Go to your GitHub repository
2. Click "Compare & pull request" for the `test-preview-deployment` branch
3. Use the PR template that will be automatically populated
4. Click "Create pull request"

## Step 5: Monitor Preview Deployment

1. The GitHub Actions workflow will automatically start
2. Check the "Actions" tab in your repository
3. Look for the "Preview Deployment" workflow
4. The preview URL will be automatically commented on the PR

## Expected Results

✅ **Preview Deployment Workflow**: Should start automatically on PR creation
✅ **Build Process**: Should complete successfully
✅ **Preview URL**: Should be posted as a comment on the PR
✅ **Testing**: Smoke tests should run on the preview
✅ **Cleanup**: Preview should be removed when PR is closed

## Troubleshooting

### If Preview Deployment Fails:
1. Check GitHub Actions logs
2. Verify Vercel secrets are correct
3. Ensure Vercel project is properly configured
4. Check if Vercel CLI is working: `vercel --version`

### If No Preview URL Appears:
1. Check the GitHub Actions workflow logs
2. Verify the Vercel deployment completed successfully
3. Check if the comment was posted (might be in a different section)

## Test Commands

```bash
# Test local development
docker-compose up -d

# Check if server is running
curl http://localhost:4001

# View logs
docker-compose logs knx-store-dev
```

## Next Steps After Successful Test

1. ✅ Preview deployment working
2. 🔄 Set up production deployment
3. 🚀 Start building the actual e-commerce features
4. 📊 Monitor performance and Core Web Vitals
5. 🔒 Configure security and environment variables 
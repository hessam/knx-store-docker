# KNX Store Development Environment

A high-performance e-commerce platform for KNX/BMS products built with Astro, TypeScript, and modern web technologies.

## 🚀 Features

- **⚡ High Performance**: Static site generation with Astro
- **🛒 E-commerce**: Complete shopping cart and checkout flow
- **💳 Payment Processing**: Stripe integration for secure payments
- **📊 WordPress Integration**: Live product data from WordPress REST API
- **🛍️ WooCommerce**: Order management and inventory
- **📱 Responsive**: Mobile-first design with Tailwind CSS
- **🌍 Multilingual**: English and Arabic (RTL) support
- **🔍 SEO Optimized**: Schema.org markup and sitemaps
- **📈 Analytics**: Google Tag Manager integration
- **🔄 Real-time**: Live data updates during builds

## 🛠️ Tech Stack

- **Frontend**: Astro 4.x, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: WordPress REST API, WooCommerce API
- **Payments**: Stripe Checkout
- **Email**: SendGrid
- **Analytics**: Google Tag Manager
- **Deployment**: Vercel
- **Development**: Docker, ESLint, Prettier

## 📋 Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- WordPress site with REST API enabled
- WooCommerce with API keys
- Stripe account with API keys

## 🚀 Quick Start

### Option 1: Universal WooCommerce Setup (Recommended)

The easiest way to get started with any WooCommerce website:

```bash
# Clone the repository
git clone <repository-url>
cd knx-store-docker

# Run the universal setup script
npm run setup:woocommerce
# or
./setup-woocommerce.sh
```

This interactive script will:
- ✅ Guide you through WooCommerce configuration
- ✅ Validate your API credentials
- ✅ Create the `.env` file automatically
- ✅ Test the build process
- ✅ Optionally setup Vercel environment variables
- ✅ Provide deployment instructions

### Option 2: Manual Setup

If you prefer to set up manually:

#### 1. Environment Configuration

Create a `.env` file in the root directory:

```env
# WooCommerce API Configuration
WOOCOMMERCE_API_URL=https://your-store.com/wp-json/wc/v3
WOOCOMMERCE_CONSUMER_KEY=ck_your_consumer_key_here
WOOCOMMERCE_CONSUMER_SECRET=cs_your_consumer_secret_here

# WordPress Configuration (if needed)
WORDPRESS_API_URL=https://your-store.com/wp-json

# Redis Configuration (optional - for caching)
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

# Site Configuration
NODE_ENV=development
SITE_URL=http://localhost:4321

# Build Configuration
ALLOW_BUILD_WITHOUT_API=true
```

#### 2. Validate Configuration

```bash
# Validate your WooCommerce setup
npm run validate:woocommerce
# or
./validate-woocommerce.sh
```

#### 3. Start Development Environment

```bash
# Start main development service
docker-compose up -d

# Start with additional services (optional)
docker-compose --profile database --profile cache up -d
```

### 4. Access the Application

- **Main App**: http://localhost:4321
- **API Server**: http://localhost:4323
- **Static Files**: http://localhost:4324
- **WordPress Proxy**: http://localhost:4325 (if enabled)
- **MySQL Database**: localhost:4326 (if enabled)
- **Redis Cache**: localhost:4327 (if enabled)

## 🏗️ Project Structure

```
knx-store-docker/
├── src/
│   ├── pages/           # Astro pages and API routes
│   ├── components/      # Reusable components
│   ├── layouts/         # Page layouts
│   ├── lib/            # Utility functions and API clients
│   ├── styles/         # Global styles
│   └── types/          # TypeScript type definitions
├── public/             # Static assets
├── nginx/              # Nginx configurations
├── docker-compose.yml  # Docker services
├── Dockerfile          # Container definition
├── package.json        # Dependencies and scripts
├── astro.config.mjs    # Astro configuration
├── tailwind.config.mjs # Tailwind CSS configuration
└── tsconfig.json       # TypeScript configuration
```

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint

# Formatting
npm run format
npm run format:check

# Testing
npm run test              # Run all tests
npm run test:watch        # Watch mode
npm run test:ci          # CI mode with coverage
npm run test:smoke       # Smoke tests
npm run test:e2e         # End-to-end tests
npm run test:performance # Performance tests

# Security
npm run security:audit   # Security audit
npm run security:fix     # Fix security issues

# WooCommerce Setup & Validation
npm run setup:woocommerce     # Interactive setup for any WooCommerce site
npm run validate:woocommerce  # Validate WooCommerce API connection
npm run setup:vercel         # Setup Vercel environment variables
```

## 🐳 Docker Services

### Main Services

- **knx-store-dev**: Main development environment
- **wordpress-proxy**: Nginx proxy for WordPress API (optional)
- **mysql-dev**: Local MySQL database (optional)
- **redis-dev**: Redis cache (optional)

### Service Profiles

```bash
# Basic development
docker-compose up -d

# With database
docker-compose --profile database up -d

# With cache
docker-compose --profile cache up -d

# With proxy
docker-compose --profile proxy up -d

# All services
docker-compose --profile database --profile cache --profile proxy up -d
```

## 🔧 Configuration

### Astro Configuration

- **Output Mode**: Hybrid (static + server-side)
- **Adapter**: Vercel serverless
- **Integrations**: Tailwind, Sitemap, React, MDX
- **Performance**: View transitions, asset optimization

### Tailwind Configuration

- **Custom Colors**: Primary, Secondary, Accent palettes
- **Typography**: Inter font family
- **Animations**: Fade-in, slide-up, bounce-gentle
- **Plugins**: Typography, Forms, Aspect Ratio

### TypeScript Configuration

- **Strict Mode**: Enabled
- **Path Mapping**: Configured for clean imports
- **Astro Integration**: Full TypeScript support

## 📊 Performance Optimization

- **Static Generation**: Pre-built pages for maximum speed
- **Image Optimization**: WebP format, lazy loading
- **Code Splitting**: Automatic bundle optimization
- **Caching**: Aggressive caching strategies
- **CDN**: Global content delivery
- **Core Web Vitals**: Optimized for 95+ scores

## 🔒 Security

- **HTTPS Only**: All production traffic encrypted
- **API Security**: Rate limiting and validation
- **Payment Security**: Stripe PCI compliance
- **Data Protection**: GDPR compliant
- **Input Validation**: Zod schema validation

## 🚀 CI/CD Pipeline

### GitHub Actions Workflow

The project includes a comprehensive CI/CD pipeline that runs on every push and pull request:

#### Pipeline Stages:

1. **Lint & Type Check**: ESLint, TypeScript validation, code formatting
2. **Unit Tests**: Jest tests with coverage reporting
3. **Build & Test**: Production build verification
4. **Security Scan**: npm audit and Snyk vulnerability scanning
5. **Performance Test**: Lighthouse CI for Core Web Vitals
6. **Deploy Preview**: Automatic preview deployment (pull requests)
7. **Deploy Staging**: Automatic deployment to staging (develop branch)
8. **Deploy Production**: Production deployment (main branch)
9. **Post-deployment**: E2E tests, performance checks, SEO submission

#### Required Secrets:

```bash
# Vercel
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id

# WordPress & WooCommerce
WORDPRESS_API_URL=https://your-wordpress-site.com/wp-json
WOOCOMMERCE_CONSUMER_KEY=ck_your_consumer_key
WOOCOMMERCE_CONSUMER_SECRET=cs_your_consumer_secret

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key

# Email & Analytics
GOOGLE_API_KEY=your_google_api_key
GOOGLE_SHEET_ID=your_google_sheet_id
GTM_ID=GTM-XXXXXXX

# Security & Monitoring
SNYK_TOKEN=your_snyk_token
SLACK_WEBHOOK_URL=your_slack_webhook_url

# Redis Configuration (optional)
UPSTASH_REDIS_REST_URL=your_url
UPSTASH_REDIS_REST_TOKEN=your_token

```

### Preview Deployments

#### Automatic Preview Deployments:

Every pull request automatically gets a preview deployment:

- **Trigger**: Created on every PR to `main` or `develop`
- **Environment**: Isolated preview environment
- **URL**: Automatically commented on PR
- **Cleanup**: Automatically removed when PR is closed/merged

#### Preview Features:

- ✅ **Isolated Environment**: Each PR gets its own deployment
- ✅ **Live Testing**: Test changes before merging
- ✅ **Automatic Updates**: New commits update the preview
- ✅ **Testing Checklist**: Built-in testing guidance
- ✅ **Performance Monitoring**: Core Web Vitals tracking
- ✅ **Mobile Testing**: Responsive design validation

#### Preview Testing Checklist:

- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] Product catalog displays
- [ ] Product details page works
- [ ] Cart functionality
- [ ] Checkout process
- [ ] Mobile responsiveness
- [ ] Performance is acceptable

### Local Development

#### Pre-commit Hooks:

```bash
# Install Husky hooks
npm run prepare

# Hooks run automatically on commit:
# - ESLint
# - TypeScript check
# - Prettier formatting
# - Unit tests
```

#### Testing:

```bash
# Run all tests
npm run test

# Run specific test suites
npm run test:unit      # Unit tests only
npm run test:e2e       # End-to-end tests
npm run test:smoke     # Smoke tests
npm run test:performance # Performance tests
```

### Deployment

#### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 🚀 Deployment to Vercel

### Prerequisites

- ✅ WooCommerce store with REST API enabled
- ✅ Valid API credentials (Consumer Key & Secret)
- ✅ At least one published product
- ✅ Vercel account

### Step 1: Setup Environment Variables

#### Option A: Automated Setup (Recommended)

```bash
# Run the universal setup script
npm run setup:woocommerce

# This will automatically:
# - Create your .env file
# - Validate WooCommerce connection
# - Setup Vercel environment variables
```

#### Option B: Manual Setup

1. **Create .env file**:
```bash
cp .env.example .env
# Edit .env with your WooCommerce credentials
```

2. **Setup Vercel environment**:
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Setup environment variables
npm run setup:vercel
```

### Step 2: Deploy to Vercel

```bash
# Deploy to production
vercel --prod

# Or link to existing project
vercel link
vercel --prod
```

### Step 3: Configure Vercel Environment Variables

In your Vercel dashboard, ensure these variables are set:

#### Required Variables:
```bash
WOOCOMMERCE_API_URL=https://yourstore.com/wp-json/wc/v3
WOOCOMMERCE_CONSUMER_KEY=ck_your_key_here
WOOCOMMERCE_CONSUMER_SECRET=cs_your_secret_here
ALLOW_BUILD_WITHOUT_API=true
```

#### Optional Variables:
```bash
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key
SENDGRID_API_KEY=your_sendgrid_key
GTM_ID=GTM-XXXXXXX
```

### Step 4: Verify Deployment

1. **Check build logs** in Vercel dashboard
2. **Test the live site** - ensure products load
3. **Validate API connection**:
   ```bash
   # Test your deployed site's API
   curl "https://your-site.vercel.app/api/sync?action=status"
   ```

### Common Vercel Deployment Issues

#### ❌ Build Fails with "Module not found"

**Solution**: Ensure all dependencies are installed
```bash
rm -rf node_modules package-lock.json
npm install
```

#### ❌ Environment Variables Not Set

**Solution**: Check Vercel dashboard environment variables
```bash
vercel env ls
```

#### ❌ WooCommerce API Timeout

**Solution**: Increase timeout in environment
```bash
VERCEL_BUILD_TIMEOUT=300
```

### Vercel Configuration

The `vercel.json` is pre-configured with:

```json
{
  "version": 2,
  "name": "knx-store",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install --legacy-peer-deps",
  "devCommand": "npm run dev",
  "framework": "astro",
  "redirects": [
    {
      "source": "/products/test",
      "destination": "/en/products/catalog-optimized",
      "permanent": true
    },
    {
      "source": "/products/catalog",
      "destination": "/en/products/catalog-optimized",
      "permanent": true
    }
  ]
}
```

### Performance Optimization

Vercel deployment includes:

- ✅ **Edge Network**: Global CDN distribution
- ✅ **Static Generation**: Pre-built pages for speed
- ✅ **Image Optimization**: Automatic WebP conversion
- ✅ **Caching**: Redis integration for API responses

### Monitoring & Analytics

After deployment:

1. **Vercel Analytics**: Monitor performance metrics
2. **Error Tracking**: Check Vercel function logs
3. **Core Web Vitals**: Monitor in Vercel dashboard
4. **Custom Domain**: Configure your domain in Vercel

### Rollback Strategy

If issues occur:

```bash
# View deployment history
vercel ls

# Rollback to previous deployment
vercel rollback
```

### Success Checklist

- [ ] ✅ Site loads without errors
- [ ] ✅ Products display correctly
- [ ] ✅ Categories work
- [ ] ✅ Search functionality works
- [ ] ✅ Mobile responsive
- [ ] ✅ Fast loading times (< 3s)
- [ ] ✅ No console errors

## 📈 Monitoring

- **Performance**: Vercel Analytics
- **Errors**: Error tracking and logging
- **Uptime**: Health checks and monitoring
- **SEO**: Search console integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🔧 WooCommerce Integration Setup

### Getting WooCommerce API Credentials

1. **Access WooCommerce Settings**:
   - Go to your WordPress admin dashboard
   - Navigate to **WooCommerce > Settings > Advanced > REST API**

2. **Generate API Keys**:
   - Click **"Add key"**
   - Enter a description (e.g., "KNX Store Integration")
   - Set permissions to **"Read/Write"**
   - Click **"Generate API key"**

3. **Copy Credentials**:
   - **Consumer Key**: `ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **Consumer Secret**: `cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Required WooCommerce Settings

Ensure your WooCommerce store has these settings:

- ✅ **REST API enabled** (WooCommerce > Settings > Advanced)
- ✅ **Products published** (not just drafts)
- ✅ **Permalinks configured** (Settings > Permalinks)
- ✅ **HTTPS enabled** (recommended for production)

### Testing Your Setup

```bash
# Validate WooCommerce connection
npm run validate:woocommerce

# This will test:
# - Environment variables
# - API connectivity
# - Data retrieval
# - Build process
```

## 🐛 Troubleshooting

### Common Issues

#### ❌ "WooCommerce API connection failed"

**Solutions**:
1. **Check API URL**: Ensure it ends with `/wp-json/wc/v3`
2. **Verify credentials**: Double-check consumer key and secret
3. **Check permissions**: Ensure API key has Read/Write permissions
4. **HTTPS requirement**: Some hosts require HTTPS for API access

```bash
# Test API manually
curl -u "ck_your_key:cs_your_secret" "https://yourstore.com/wp-json/wc/v3/products?per_page=1"
```

#### ❌ "No products found"

**Solutions**:
1. **Add products**: Ensure your WooCommerce store has published products
2. **Check product visibility**: Products should be visible in catalog
3. **Stock status**: Products should be in stock or visibility should allow out-of-stock items

#### ❌ "Build fails on Vercel"

**Solutions**:
1. **Environment variables**: Ensure all required variables are set in Vercel dashboard
2. **ALLOW_BUILD_WITHOUT_API**: Set this to `true` in Vercel environment variables
3. **Check logs**: Review Vercel build logs for specific errors

#### ❌ "Redis connection failed"

**Solutions**:
1. **Optional dependency**: Redis is optional - the app works without it
2. **Check credentials**: Verify Upstash Redis URL and token
3. **Network access**: Ensure Vercel can access your Redis instance

### Debug Commands

```bash
# Test WooCommerce API manually
curl -u "ck_key:cs_secret" "https://yourstore.com/wp-json/wc/v3/products?per_page=1"

# Check environment variables
npm run validate:woocommerce

# Test build locally
npm run build

# Check Vercel environment
vercel env ls
```

### Getting Help

If you're still having issues:

1. **Run validation script**: `npm run validate:woocommerce`
2. **Check the logs**: Look for specific error messages
3. **Common solutions**:
   - Ensure WooCommerce REST API is enabled
   - Verify API credentials have correct permissions
   - Check that your store has published products
   - Ensure HTTPS is configured for production

### Alternative Setup Methods

If the automated setup doesn't work:

1. **Manual .env creation**: Copy `.env.example` and fill in your values
2. **Direct Vercel setup**: Set environment variables directly in Vercel dashboard
3. **Docker development**: Use `docker-compose up -d` for local development

## 🌐 Universal WooCommerce Compatibility

This KNX Store is designed to work with **any WooCommerce website** by following these principles:

### ✅ What Makes It Universal

1. **Standard WooCommerce REST API**: Uses only official WooCommerce endpoints
2. **No Custom Plugins Required**: Works with vanilla WooCommerce installations
3. **Flexible Authentication**: Supports all WooCommerce authentication methods
4. **Fallback Mechanisms**: Gracefully handles API failures and missing data
5. **Auto-Detection**: Automatically adapts to different WooCommerce configurations

### 🛠️ Supported WooCommerce Versions

- ✅ **WooCommerce 3.0+** (REST API v3)
- ✅ **WordPress 5.0+**
- ✅ **All hosting providers** (including those with Cloudflare)
- ✅ **HTTP and HTTPS** sites
- ✅ **All permalink structures**

### 🔧 WooCommerce Requirements

**Minimum Requirements**:
- ✅ WordPress installed
- ✅ WooCommerce plugin active
- ✅ REST API enabled (default)
- ✅ At least one published product
- ✅ Valid SSL certificate (recommended)

**Optional Enhancements**:
- 🔄 Redis caching (Upstash)
- 🌐 Multi-language support (WPML/Polylang)
- 💳 Payment processing (Stripe)
- 📧 Email notifications (SendGrid)
- 📊 Analytics (Google Tag Manager)

### 🎯 Use Cases

This system works perfectly for:

- **E-commerce Stores**: Complete shopping experience
- **Catalog Sites**: Product showcase without checkout
- **B2B Portals**: Wholesale pricing and quotes
- **Marketplaces**: Multi-vendor product display
- **Intranets**: Internal product catalogs
- **Mobile Apps**: Backend for mobile applications

### 🚀 Getting Started with Any WooCommerce Site

```bash
# 1. Clone the repository
git clone <repository-url>
cd knx-store-docker

# 2. Run universal setup
npm run setup:woocommerce

# 3. Follow the prompts to connect your WooCommerce site

# 4. Deploy to Vercel
vercel --prod
```

### 📊 Compatibility Matrix

| WooCommerce Feature | Support Level | Notes |
|-------------------|---------------|-------|
| **Products** | ✅ Full | All product types supported |
| **Categories** | ✅ Full | Hierarchical categories |
| **Images** | ✅ Full | Multiple images per product |
| **Variations** | ✅ Full | Size, color, etc. |
| **Attributes** | ✅ Full | Custom product attributes |
| **Inventory** | ✅ Full | Stock management |
| **Pricing** | ✅ Full | Regular, sale, currency |
| **SEO** | ✅ Full | Meta titles, descriptions |
| **Multilingual** | ✅ Full | WPML/Polylang compatible |
| **Custom Fields** | ✅ Full | ACF and custom meta |
| **Coupons** | ✅ Full | Discount codes |
| **Taxes** | ✅ Full | Tax calculations |
| **Shipping** | ✅ Full | Zones and rates |

### 🔒 Security Features

- **API Key Protection**: Secure credential management
- **Rate Limiting**: Built-in API throttling
- **Input Validation**: Sanitized user inputs
- **HTTPS Only**: Secure connections
- **Error Handling**: No sensitive data in errors

### 📈 Performance Features

- **Static Generation**: Pre-built pages for speed
- **Redis Caching**: 10x faster API responses
- **Image Optimization**: Automatic WebP conversion
- **CDN Delivery**: Global content distribution
- **Lazy Loading**: Optimized resource loading

---

## 🎉 Summary

The KNX Store is now a **universal WooCommerce frontend** that can be deployed with any WooCommerce website in minutes. The system includes:

### ✅ **Phase 1 COMPLETE: Zero-Error Vercel Deployment**
- Fixed build scripts with proper dependency installation
- Enhanced environment variable handling
- Added comprehensive error handling and logging
- Created validation scripts for testing

### ✅ **Phase 2 COMPLETE: Universal WooCommerce Setup**
- Interactive setup script for any WooCommerce site
- API validation and testing
- Automatic environment configuration
- Comprehensive documentation and troubleshooting

### 🚀 **Ready for Production**
- Works with any WooCommerce 3.0+ installation
- Supports all major hosting providers
- Includes fallback mechanisms for reliability
- Comprehensive error handling and recovery
- Performance optimized for global scale

### 📞 **Next Steps**
1. Run `npm run setup:woocommerce` to configure with your WooCommerce site
2. Run `npm run validate:woocommerce` to test the connection
3. Deploy to Vercel with `vercel --prod`
4. Your store will be live in minutes!

**The KNX Store is now ready to work with any WooCommerce website worldwide! 🌍**

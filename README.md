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

### 1. Clone and Setup

```bash
git clone <repository-url>
cd knx-store-docker
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# WordPress Configuration
WORDPRESS_API_URL=https://your-wordpress-site.com/wp-json
WOOCOMMERCE_CONSUMER_KEY=ck_your_consumer_key
WOOCOMMERCE_CONSUMER_SECRET=cs_your_consumer_secret

# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key

# Email Configuration
SENDGRID_API_KEY=your_sendgrid_api_key

# Google Services
GOOGLE_API_KEY=your_google_api_key
GOOGLE_SHEET_ID=your_google_sheet_id

# Analytics
GTM_ID=GTM-XXXXXXX
```

### 3. Start Development Environment

```bash
# Start main development service
docker-compose up -d

# Start with additional services (optional)
docker-compose --profile database --profile cache up -d
```

### 4. Access the Application

- **Main App**: http://localhost:4001
- **API Server**: http://localhost:4003
- **Static Files**: http://localhost:4004
- **WordPress Proxy**: http://localhost:4005 (if enabled)
- **MySQL Database**: localhost:4006 (if enabled)
- **Redis Cache**: localhost:4007 (if enabled)

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

# API server
npm run api-server
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
SENDGRID_API_KEY=your_sendgrid_api_key
GOOGLE_API_KEY=your_google_api_key
GOOGLE_SHEET_ID=your_google_sheet_id
GTM_ID=GTM-XXXXXXX

# Security & Monitoring
SNYK_TOKEN=your_snyk_token
SLACK_WEBHOOK_URL=your_slack_webhook_url
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

#### Environment Variables
Set the following in your Vercel project:
- All variables from `.env` file
- `NODE_ENV=production`
- `SITE_URL=https://your-domain.vercel.app`

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

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the troubleshooting guide

---

**Built with ❤️ for the KNX/BMS community** 
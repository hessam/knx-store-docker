# 🏗️ Project Structure - KNX Store

## 📁 Directory Structure

```
knx-store-docker/
├── 📁 src/
│   ├── 📁 components/          # Reusable UI components
│   │   ├── Button.astro       # Button component with variants
│   │   ├── Button.stories.tsx # Storybook stories for Button
│   │   ├── Card.astro         # Card component with variants
│   │   └── ProductCard.astro  # Product display component
│   │
│   ├── 📁 lib/
│   │   └── 📁 api/            # API abstraction layer
│   │       ├── wordpress.ts   # WordPress REST API client
│   │       └── woocommerce.ts # WooCommerce REST API client
│   │
│   ├── 📁 utils/              # Utility functions
│   │   └── format.ts          # Data formatting utilities
│   │
│   ├── 📁 pages/              # Astro pages
│   │   ├── index.astro        # Homepage
│   │   ├── debug.astro        # Debug page
│   │   └── test.astro         # Test page
│   │
│   ├── 📁 styles/             # Global styles
│   │   └── global.css         # Global CSS
│   │
│   ├── 📁 types/              # TypeScript type definitions
│   ├── 📁 stores/             # State management
│   ├── 📁 hooks/              # Custom React hooks
│   └── 📁 layouts/            # Layout components
│
├── 📁 .storybook/             # Storybook configuration
│   ├── main.ts               # Main Storybook config
│   └── preview.ts            # Storybook preview config
│
├── 📁 .github/workflows/      # CI/CD workflows
│   ├── simple-deploy.yml     # Main deployment workflow
│   ├── debug-vercel.yml      # Debug workflow
│   └── test-deploy.yml       # Test deployment workflow
│
├── 📄 package.json           # Dependencies and scripts
├── 📄 astro.config.mjs       # Astro configuration
├── 📄 vercel.json            # Vercel deployment config
├── 📄 tailwind.config.mjs    # Tailwind CSS config
├── 📄 tsconfig.json          # TypeScript config
└── 📄 jest.config.js         # Jest testing config
```

## 🔧 API Abstraction Layer

### **WordPress API Client** (`src/lib/api/wordpress.ts`)

**Features:**
- ✅ **TypeScript interfaces** for all WordPress data types
- ✅ **Axios-based HTTP client** with interceptors
- ✅ **Error handling** with detailed logging
- ✅ **Request/response logging** for debugging
- ✅ **Health check** functionality

**Available Methods:**
```typescript
// Posts
await wordPressAPI.getPosts(params)
await wordPressAPI.getPost(slug)

// Pages
await wordPressAPI.getPages(params)
await wordPressAPI.getPage(slug)

// Media
await wordPressAPI.getMedia(mediaId)

// Categories & Tags
await wordPressAPI.getCategories()
await wordPressAPI.getTags()

// Search
await wordPressAPI.search(query, type)

// Health Check
await wordPressAPI.healthCheck()
```

### **WooCommerce API Client** (`src/lib/api/woocommerce.ts`)

**Features:**
- ✅ **TypeScript interfaces** for all WooCommerce data types
- ✅ **Basic authentication** with consumer key/secret
- ✅ **Comprehensive product management**
- ✅ **Order management** (create, read, update)
- ✅ **Category and tag management**

**Available Methods:**
```typescript
// Products
await wooCommerceAPI.getProducts(params)
await wooCommerceAPI.getProduct(productId)
await wooCommerceAPI.getProductBySlug(slug)

// Categories
await wooCommerceAPI.getCategories(params)
await wooCommerceAPI.getCategory(categoryId)

// Orders
await wooCommerceAPI.getOrders(params)
await wooCommerceAPI.getOrder(orderId)
await wooCommerceAPI.createOrder(orderData)
await wooCommerceAPI.updateOrder(orderId, orderData)

// Search
await wooCommerceAPI.searchProducts(query, params)

// Health Check
await wooCommerceAPI.healthCheck()
```

## 🎨 Component Library

### **Button Component** (`src/components/Button.astro`)

**Features:**
- ✅ **Multiple variants**: primary, secondary, outline, ghost, danger
- ✅ **Size options**: sm, md, lg, xl
- ✅ **Loading state** with spinner
- ✅ **Disabled state**
- ✅ **Full width option**
- ✅ **Link support** (renders as `<a>` tag)
- ✅ **GTM tracking** attributes
- ✅ **Accessibility** features

**Usage:**
```astro
<Button variant="primary" size="md" loading={false}>
  Click me
</Button>

<Button href="/products" variant="outline">
  View Products
</Button>
```

### **Card Component** (`src/components/Card.astro`)

**Features:**
- ✅ **Multiple variants**: default, elevated, outlined, flat
- ✅ **Padding options**: none, sm, md, lg
- ✅ **Hover effects** with animations
- ✅ **Clickable state** with cursor changes
- ✅ **Link support** (renders as `<a>` tag)
- ✅ **GTM tracking** attributes

**Usage:**
```astro
<Card variant="elevated" hover={true} padding="md">
  <h3>Card Title</h3>
  <p>Card content...</p>
</Card>
```

### **ProductCard Component** (`src/components/ProductCard.astro`)

**Features:**
- ✅ **WooCommerce product integration**
- ✅ **Image handling** with fallbacks
- ✅ **Price formatting** with sale support
- ✅ **Content formatting** with HTML stripping
- ✅ **Add to cart functionality**
- ✅ **GTM tracking** for e-commerce events

**Usage:**
```astro
<ProductCard 
  product={wooCommerceProduct}
  showDescription={true}
  showPrice={true}
  showAddToCart={true}
/>
```

## 🛠️ Utility Functions

### **Format Utilities** (`src/utils/format.ts`)

**Available Functions:**
```typescript
// Content formatting
stripHtml(html: string)
truncateText(text: string, maxLength: number)
formatWordPressContent(content: string, maxLength?: number)
decodeHtmlEntities(text: string)

// Price formatting
formatPrice(price: string | number, currency?: string)

// Date formatting
formatDate(dateString: string, format?: 'short' | 'long' | 'relative')

// Text utilities
generateSlug(text: string)
capitalizeWords(text: string)
generateId(prefix?: string)

// Image utilities
extractFirstImage(content: string)
extractAllImages(content: string)

// Validation
isValidUrl(string: string)
sanitizeAttribute(value: string)

// Number formatting
formatNumber(num: number)
formatFileSize(bytes: number)
```

## 📚 Storybook Integration

### **Configuration**
- ✅ **React framework** with TypeScript support
- ✅ **Tailwind CSS** integration
- ✅ **Multiple backgrounds** (light, dark, gray)
- ✅ **Auto-documentation** with JSDoc
- ✅ **Interactive controls** for all props

### **Available Scripts**
```bash
npm run storybook        # Start Storybook dev server
npm run build-storybook  # Build Storybook for production
```

### **Story Examples**
- ✅ **Button stories** with all variants and states
- ✅ **Interactive controls** for testing
- ✅ **Documentation** auto-generated from TypeScript

## 🔄 State Management

### **Planned Structure**
```
src/stores/
├── cart.ts              # Shopping cart state
├── user.ts              # User authentication state
├── products.ts          # Product catalog state
└── orders.ts            # Order management state
```

## 🎣 Custom Hooks

### **Planned Structure**
```
src/hooks/
├── useCart.ts           # Shopping cart hooks
├── useProducts.ts       # Product data hooks
├── useWordPress.ts      # WordPress data hooks
└── useWooCommerce.ts    # WooCommerce data hooks
```

## 🎨 Layouts

### **Planned Structure**
```
src/layouts/
├── BaseLayout.astro     # Base layout with common elements
├── ProductLayout.astro  # Product-specific layout
└── CheckoutLayout.astro # Checkout-specific layout
```

## 🧪 Testing Structure

### **Current Setup**
- ✅ **Jest** for unit testing
- ✅ **Testing Library** for component testing
- ✅ **TypeScript** support
- ✅ **Coverage reporting**

### **Test Files**
```
src/
├── components/__tests__/
│   ├── Button.test.tsx
│   ├── Card.test.tsx
│   └── ProductCard.test.tsx
├── lib/api/__tests__/
│   ├── wordpress.test.ts
│   └── woocommerce.test.ts
└── utils/__tests__/
    └── format.test.ts
```

## 🚀 Development Workflow

### **Available Scripts**
```bash
# Development
npm run dev              # Start Astro dev server
npm run storybook        # Start Storybook

# Building
npm run build            # Build for production
npm run build-storybook  # Build Storybook

# Testing
npm test                 # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run type-check       # Run TypeScript checks
npm run format           # Format code with Prettier
```

## 📊 Environment Variables

### **Required Variables**
```bash
# WordPress
WORDPRESS_API_URL=https://your-wordpress.com/wp-json

# WooCommerce
WOOCOMMERCE_CONSUMER_KEY=your_consumer_key
WOOCOMMERCE_CONSUMER_SECRET=your_consumer_secret

# Vercel (for deployment)
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
```

## 🎯 Next Steps

### **Phase 2: Core Features**
- 🔄 **Product catalog pages** with dynamic routing
- 🔄 **Shopping cart functionality** with state management
- 🔄 **User authentication** integration
- 🔄 **Checkout process** with Stripe integration

### **Phase 3: Advanced Features**
- 🔄 **Real-time inventory** updates
- 🔄 **Advanced search** and filtering
- 🔄 **Product reviews** and ratings
- 🔄 **Order tracking** system

---

**Status**: 🟢 **PROJECT STRUCTURE COMPLETE**
**Next Action**: Implement core features using the established foundation 
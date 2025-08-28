# Environment Configuration

This project uses environment variables to configure the WooCommerce API connection and other services.

## Quick Setup

1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Update the WooCommerce credentials in `.env`:**
   ```env
   WOOCOMMERCE_API_URL=https://your-store.com/wp-json/wc/v3
   WOOCOMMERCE_CONSUMER_KEY=ck_your_actual_key_here
   WOOCOMMERCE_CONSUMER_SECRET=cs_your_actual_secret_here
   ```

## Getting WooCommerce API Credentials

1. Go to your WordPress admin dashboard
2. Navigate to **WooCommerce > Settings > Advanced > REST API**
3. Click **"Add Key"**
4. Set **Description**: "KNX Store Integration"
5. Set **User**: Choose an administrator user
6. Set **Permissions**: "Read"
7. Click **"Generate API Key"**
8. Copy the **Consumer Key** and **Consumer Secret** to your `.env` file

## Environment Variables

### Required for Production
- `WOOCOMMERCE_API_URL` - Your WooCommerce REST API endpoint
- `WOOCOMMERCE_CONSUMER_KEY` - WooCommerce API consumer key
- `WOOCOMMERCE_CONSUMER_SECRET` - WooCommerce API consumer secret

### Optional
- `UPSTASH_REDIS_REST_URL` - Redis URL for caching (improves performance)
- `UPSTASH_REDIS_REST_TOKEN` - Redis authentication token
- `GOOGLE_TRANSLATE_API_KEY` - For automatic product translation
- `ALLOW_BUILD_WITHOUT_API` - Set to "true" to build with fallback data

## Different Store Configuration

To use this with a different WooCommerce store:

1. Update `WOOCOMMERCE_API_URL` to point to your store
2. Generate new API credentials for your store
3. Update the consumer key and secret
4. Test the connection: `npm run dev` and visit `/products/catalog`

## Fallback Mode

If API credentials are missing, the site will:
- Use fallback product data during build
- Show sample products in the catalog
- Allow the site to build and deploy successfully
- Log warnings about missing credentials

This is useful for:
- Development without API access
- CI/CD environments
- Demo deployments

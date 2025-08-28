#!/bin/bash

# KNX Store Build Script
# This script loads environment variables and runs the build

echo "🔧 Loading environment variables..."
export $(cat .env | grep -v '^#' | xargs)

echo "✅ Environment variables loaded:"
echo "  - WooCommerce API URL: $WOOCOMMERCE_API_URL"
echo "  - WooCommerce Consumer Key: ${WOOCOMMERCE_CONSUMER_KEY:0:20}..."
echo "  - Allow Build Without API: $ALLOW_BUILD_WITHOUT_API"

echo ""
echo "🚀 Starting Astro build..."
npm run build

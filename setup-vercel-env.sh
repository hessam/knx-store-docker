#!/bin/bash

# Setup script for Vercel environment variables
# This script reads .env file and sets up Vercel environment variables

set -e

echo "Setting up Vercel environment variables..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Error: .env file not found. Please create one with your WooCommerce credentials."
    exit 1
fi

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Read environment variables from .env file and set them in Vercel
echo "Reading .env file and setting Vercel environment variables..."

# Extract key environment variables
WOOCOMMERCE_API_URL=$(grep "WOOCOMMERCE_API_URL=" .env | cut -d '=' -f2 | tr -d '"' | tr -d "'")
WOOCOMMERCE_CONSUMER_KEY=$(grep "WOOCOMMERCE_CONSUMER_KEY=" .env | cut -d '=' -f2 | tr -d '"' | tr -d "'")
WOOCOMMERCE_CONSUMER_SECRET=$(grep "WOOCOMMERCE_CONSUMER_SECRET=" .env | cut -d '=' -f2 | tr -d '"' | tr -d "'")
UPSTASH_REDIS_REST_URL=$(grep "UPSTASH_REDIS_REST_URL=" .env | cut -d '=' -f2 | tr -d '"' | tr -d "'")
UPSTASH_REDIS_REST_TOKEN=$(grep "UPSTASH_REDIS_REST_TOKEN=" .env | cut -d '=' -f2 | tr -d '"' | tr -d "'")
ALLOW_BUILD_WITHOUT_API=$(grep "ALLOW_BUILD_WITHOUT_API=" .env | cut -d '=' -f2 | tr -d '"' | tr -d "'")

# Set environment variables in Vercel (production, preview, and development)
echo "Setting WOOCOMMERCE_API_URL..."
vercel env add WOOCOMMERCE_API_URL production <<< "$WOOCOMMERCE_API_URL"
vercel env add WOOCOMMERCE_API_URL preview <<< "$WOOCOMMERCE_API_URL"

echo "Setting WOOCOMMERCE_CONSUMER_KEY..."
vercel env add WOOCOMMERCE_CONSUMER_KEY production <<< "$WOOCOMMERCE_CONSUMER_KEY"
vercel env add WOOCOMMERCE_CONSUMER_KEY preview <<< "$WOOCOMMERCE_CONSUMER_KEY"

echo "Setting WOOCOMMERCE_CONSUMER_SECRET..."
vercel env add WOOCOMMERCE_CONSUMER_SECRET production <<< "$WOOCOMMERCE_CONSUMER_SECRET"
vercel env add WOOCOMMERCE_CONSUMER_SECRET preview <<< "$WOOCOMMERCE_CONSUMER_SECRET"

echo "Setting UPSTASH_REDIS_REST_URL..."
vercel env add UPSTASH_REDIS_REST_URL production <<< "$UPSTASH_REDIS_REST_URL"
vercel env add UPSTASH_REDIS_REST_URL preview <<< "$UPSTASH_REDIS_REST_URL"

echo "Setting UPSTASH_REDIS_REST_TOKEN..."
vercel env add UPSTASH_REDIS_REST_TOKEN production <<< "$UPSTASH_REDIS_REST_TOKEN"
vercel env add UPSTASH_REDIS_REST_TOKEN preview <<< "$UPSTASH_REDIS_REST_TOKEN"

echo "Setting ALLOW_BUILD_WITHOUT_API..."
vercel env add ALLOW_BUILD_WITHOUT_API production <<< "${ALLOW_BUILD_WITHOUT_API:-true}"
vercel env add ALLOW_BUILD_WITHOUT_API preview <<< "${ALLOW_BUILD_WITHOUT_API:-true}"

echo "✅ Environment variables have been set in Vercel!"
echo ""
echo "To verify the setup:"
echo "1. Run: vercel env ls"
echo "2. Deploy: vercel --prod"
echo ""
echo "The application should now work on Vercel with your WooCommerce credentials."

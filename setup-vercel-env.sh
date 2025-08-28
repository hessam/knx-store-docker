#!/bin/bash

# Setup script for Vercel environment variables
# This script reads .env file and sets up Vercel environment variables

set -e

echo "Setting up Vercel environment variables..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Error: .env file not found. Please create one with your WooCommerce credentials."
    echo "You can copy .env.example and fill in your values."
    exit 1
fi

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Function to extract environment variable value
extract_env_value() {
    local var_name=$1
    local value=$(grep "^${var_name}=" .env | cut -d '=' -f2- | sed 's/^"//' | sed 's/"$//' | sed "s/^'//" | sed "s/'$//")
    echo "$value"
}

# Read environment variables from .env file
echo "Reading .env file and setting Vercel environment variables..."

WOOCOMMERCE_API_URL=$(extract_env_value "WOOCOMMERCE_API_URL")
WOOCOMMERCE_CONSUMER_KEY=$(extract_env_value "WOOCOMMERCE_CONSUMER_KEY")
WOOCOMMERCE_CONSUMER_SECRET=$(extract_env_value "WOOCOMMERCE_CONSUMER_SECRET")
UPSTASH_REDIS_REST_URL=$(extract_env_value "UPSTASH_REDIS_REST_URL")
UPSTASH_REDIS_REST_TOKEN=$(extract_env_value "UPSTASH_REDIS_REST_TOKEN")
GOOGLE_TRANSLATE_API_KEY=$(extract_env_value "GOOGLE_TRANSLATE_API_KEY")
SENDGRID_API_KEY=$(extract_env_value "SENDGRID_API_KEY")
STRIPE_PUBLISHABLE_KEY=$(extract_env_value "STRIPE_PUBLISHABLE_KEY")
STRIPE_SECRET_KEY=$(extract_env_value "STRIPE_SECRET_KEY")
GTM_ID=$(extract_env_value "GTM_ID")
ALLOW_BUILD_WITHOUT_API=$(extract_env_value "ALLOW_BUILD_WITHOUT_API")

# Validate required variables
if [ -z "$WOOCOMMERCE_API_URL" ]; then
    echo "Warning: WOOCOMMERCE_API_URL is not set. Build will use fallback data."
fi

if [ -z "$WOOCOMMERCE_CONSUMER_KEY" ]; then
    echo "Warning: WOOCOMMERCE_CONSUMER_KEY is not set. Build will use fallback data."
fi

if [ -z "$WOOCOMMERCE_CONSUMER_SECRET" ]; then
    echo "Warning: WOOCOMMERCE_CONSUMER_SECRET is not set. Build will use fallback data."
fi

# Set ALLOW_BUILD_WITHOUT_API to true by default for Vercel builds
ALLOW_BUILD_WITHOUT_API=${ALLOW_BUILD_WITHOUT_API:-true}

# Set environment variables in Vercel (production, preview, and development)
echo "Setting WOOCOMMERCE_API_URL..."
vercel env add WOOCOMMERCE_API_URL production <<< "$WOOCOMMERCE_API_URL" 2>/dev/null || vercel env rm WOOCOMMERCE_API_URL production 2>/dev/null; vercel env add WOOCOMMERCE_API_URL production <<< "$WOOCOMMERCE_API_URL"
vercel env add WOOCOMMERCE_API_URL preview <<< "$WOOCOMMERCE_API_URL" 2>/dev/null || vercel env rm WOOCOMMERCE_API_URL preview 2>/dev/null; vercel env add WOOCOMMERCE_API_URL preview <<< "$WOOCOMMERCE_API_URL"

echo "Setting WOOCOMMERCE_CONSUMER_KEY..."
vercel env add WOOCOMMERCE_CONSUMER_KEY production <<< "$WOOCOMMERCE_CONSUMER_KEY" 2>/dev/null || vercel env rm WOOCOMMERCE_CONSUMER_KEY production 2>/dev/null; vercel env add WOOCOMMERCE_CONSUMER_KEY production <<< "$WOOCOMMERCE_CONSUMER_KEY"
vercel env add WOOCOMMERCE_CONSUMER_KEY preview <<< "$WOOCOMMERCE_CONSUMER_KEY" 2>/dev/null || vercel env rm WOOCOMMERCE_CONSUMER_KEY preview 2>/dev/null; vercel env add WOOCOMMERCE_CONSUMER_KEY preview <<< "$WOOCOMMERCE_CONSUMER_KEY"

echo "Setting WOOCOMMERCE_CONSUMER_SECRET..."
vercel env add WOOCOMMERCE_CONSUMER_SECRET production <<< "$WOOCOMMERCE_CONSUMER_SECRET" 2>/dev/null || vercel env rm WOOCOMMERCE_CONSUMER_SECRET production 2>/dev/null; vercel env add WOOCOMMERCE_CONSUMER_SECRET production <<< "$WOOCOMMERCE_CONSUMER_SECRET"
vercel env add WOOCOMMERCE_CONSUMER_SECRET preview <<< "$WOOCOMMERCE_CONSUMER_SECRET" 2>/dev/null || vercel env rm WOOCOMMERCE_CONSUMER_SECRET preview 2>/dev/null; vercel env add WOOCOMMERCE_CONSUMER_SECRET preview <<< "$WOOCOMMERCE_CONSUMER_SECRET"

echo "Setting UPSTASH_REDIS_REST_URL..."
vercel env add UPSTASH_REDIS_REST_URL production <<< "$UPSTASH_REDIS_REST_URL" 2>/dev/null || vercel env rm UPSTASH_REDIS_REST_URL production 2>/dev/null; vercel env add UPSTASH_REDIS_REST_URL production <<< "$UPSTASH_REDIS_REST_URL"
vercel env add UPSTASH_REDIS_REST_URL preview <<< "$UPSTASH_REDIS_REST_URL" 2>/dev/null || vercel env rm UPSTASH_REDIS_REST_URL preview 2>/dev/null; vercel env add UPSTASH_REDIS_REST_URL preview <<< "$UPSTASH_REDIS_REST_URL"

echo "Setting UPSTASH_REDIS_REST_TOKEN..."
vercel env add UPSTASH_REDIS_REST_TOKEN production <<< "$UPSTASH_REDIS_REST_TOKEN" 2>/dev/null || vercel env rm UPSTASH_REDIS_REST_TOKEN production 2>/dev/null; vercel env add UPSTASH_REDIS_REST_TOKEN production <<< "$UPSTASH_REDIS_REST_TOKEN"
vercel env add UPSTASH_REDIS_REST_TOKEN preview <<< "$UPSTASH_REDIS_REST_TOKEN" 2>/dev/null || vercel env rm UPSTASH_REDIS_REST_TOKEN preview 2>/dev/null; vercel env add UPSTASH_REDIS_REST_TOKEN preview <<< "$UPSTASH_REDIS_REST_TOKEN"

echo "Setting GOOGLE_TRANSLATE_API_KEY..."
vercel env add GOOGLE_TRANSLATE_API_KEY production <<< "$GOOGLE_TRANSLATE_API_KEY" 2>/dev/null || vercel env rm GOOGLE_TRANSLATE_API_KEY production 2>/dev/null; vercel env add GOOGLE_TRANSLATE_API_KEY production <<< "$GOOGLE_TRANSLATE_API_KEY"
vercel env add GOOGLE_TRANSLATE_API_KEY preview <<< "$GOOGLE_TRANSLATE_API_KEY" 2>/dev/null || vercel env rm GOOGLE_TRANSLATE_API_KEY preview 2>/dev/null; vercel env add GOOGLE_TRANSLATE_API_KEY preview <<< "$GOOGLE_TRANSLATE_API_KEY"

echo "Setting SENDGRID_API_KEY..."
vercel env add SENDGRID_API_KEY production <<< "$SENDGRID_API_KEY" 2>/dev/null || vercel env rm SENDGRID_API_KEY production 2>/dev/null; vercel env add SENDGRID_API_KEY production <<< "$SENDGRID_API_KEY"
vercel env add SENDGRID_API_KEY preview <<< "$SENDGRID_API_KEY" 2>/dev/null || vercel env rm SENDGRID_API_KEY preview 2>/dev/null; vercel env add SENDGRID_API_KEY preview <<< "$SENDGRID_API_KEY"

echo "Setting STRIPE_PUBLISHABLE_KEY..."
vercel env add STRIPE_PUBLISHABLE_KEY production <<< "$STRIPE_PUBLISHABLE_KEY" 2>/dev/null || vercel env rm STRIPE_PUBLISHABLE_KEY production 2>/dev/null; vercel env add STRIPE_PUBLISHABLE_KEY production <<< "$STRIPE_PUBLISHABLE_KEY"
vercel env add STRIPE_PUBLISHABLE_KEY preview <<< "$STRIPE_PUBLISHABLE_KEY" 2>/dev/null || vercel env rm STRIPE_PUBLISHABLE_KEY preview 2>/dev/null; vercel env add STRIPE_PUBLISHABLE_KEY preview <<< "$STRIPE_PUBLISHABLE_KEY"

echo "Setting STRIPE_SECRET_KEY..."
vercel env add STRIPE_SECRET_KEY production <<< "$STRIPE_SECRET_KEY" 2>/dev/null || vercel env rm STRIPE_SECRET_KEY production 2>/dev/null; vercel env add STRIPE_SECRET_KEY production <<< "$STRIPE_SECRET_KEY"
vercel env add STRIPE_SECRET_KEY preview <<< "$STRIPE_SECRET_KEY" 2>/dev/null || vercel env rm STRIPE_SECRET_KEY preview 2>/dev/null; vercel env add STRIPE_SECRET_KEY preview <<< "$STRIPE_SECRET_KEY"

echo "Setting GTM_ID..."
vercel env add GTM_ID production <<< "$GTM_ID" 2>/dev/null || vercel env rm GTM_ID production 2>/dev/null; vercel env add GTM_ID production <<< "$GTM_ID"
vercel env add GTM_ID preview <<< "$GTM_ID" 2>/dev/null || vercel env rm GTM_ID preview 2>/dev/null; vercel env add GTM_ID preview <<< "$GTM_ID"

echo "Setting ALLOW_BUILD_WITHOUT_API..."
vercel env add ALLOW_BUILD_WITHOUT_API production <<< "$ALLOW_BUILD_WITHOUT_API" 2>/dev/null || vercel env rm ALLOW_BUILD_WITHOUT_API production 2>/dev/null; vercel env add ALLOW_BUILD_WITHOUT_API production <<< "$ALLOW_BUILD_WITHOUT_API"
vercel env add ALLOW_BUILD_WITHOUT_API preview <<< "$ALLOW_BUILD_WITHOUT_API" 2>/dev/null || vercel env rm ALLOW_BUILD_WITHOUT_API preview 2>/dev/null; vercel env add ALLOW_BUILD_WITHOUT_API preview <<< "$ALLOW_BUILD_WITHOUT_API"

echo "✅ Environment variables have been set in Vercel!"
echo ""
echo "To verify the setup:"
echo "1. Run: vercel env ls"
echo "2. Deploy: vercel --prod"
echo ""
echo "The application should now work on Vercel with your WooCommerce credentials."

#!/bin/bash

# Universal WooCommerce Setup Script for KNX Store
# This script helps set up the KNX Store with any WooCommerce website

set -e

echo "🌐 KNX Store - Universal WooCommerce Setup"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}$1${NC}"
}

# Function to validate WooCommerce API
validate_woocommerce_api() {
    local api_url=$1
    local consumer_key=$2
    local consumer_secret=$3

    print_status "Validating WooCommerce API connection..."

    # Remove trailing slash from API URL
    api_url=${api_url%/}

    # Test API connection
    local response=$(curl -s -w "\n%{http_code}" \
        -u "${consumer_key}:${consumer_secret}" \
        "${api_url}/products?per_page=1" 2>/dev/null)

    local http_code=$(echo "$response" | tail -n1)
    local api_response=$(echo "$response" | head -n -1)

    if [ "$http_code" = "200" ]; then
        print_status "✅ WooCommerce API connection successful!"
        echo "$api_response" | jq '.[] | {id: .id, name: .name, status: .status}' 2>/dev/null || echo "API Response: $api_response"
        return 0
    else
        print_error "❌ WooCommerce API connection failed!"
        print_error "HTTP Status: $http_code"
        print_error "Response: $api_response"
        return 1
    fi
}

# Function to create .env file
create_env_file() {
    local api_url=$1
    local consumer_key=$2
    local consumer_secret=$3
    local redis_url=$4
    local redis_token=$5

    print_status "Creating .env file..."

    cat > .env << EOF
# WooCommerce API Configuration
WOOCOMMERCE_API_URL=${api_url}
WOOCOMMERCE_CONSUMER_KEY=${consumer_key}
WOOCOMMERCE_CONSUMER_SECRET=${consumer_secret}

# WordPress Configuration (if needed)
WORDPRESS_API_URL=${api_url%/*/*}

# Redis Configuration (optional - for caching)
UPSTASH_REDIS_REST_URL=${redis_url}
UPSTASH_REDIS_REST_TOKEN=${redis_token}

# Google Services (optional - for translation)
GOOGLE_TRANSLATE_API_KEY=your_google_translate_api_key

# Site Configuration
NODE_ENV=development
SITE_URL=http://localhost:4321

# Build Configuration
ALLOW_BUILD_WITHOUT_API=true

# Email Configuration (optional)
SENDGRID_API_KEY=your_sendgrid_api_key

# Payment Configuration (optional)
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Analytics (optional)
GTM_ID=GTM-XXXXXXX
EOF

    print_status "✅ .env file created successfully!"
}

# Function to setup Vercel environment
setup_vercel_env() {
    print_header "Setting up Vercel environment variables..."

    if ! command -v vercel &> /dev/null; then
        print_status "Installing Vercel CLI..."
        npm install -g vercel
    fi

    print_status "Setting environment variables in Vercel..."
    ./setup-vercel-env.sh

    print_status "✅ Vercel environment setup complete!"
}

# Function to test local build
test_local_build() {
    print_header "Testing local build..."

    print_status "Installing dependencies..."
    npm install

    print_status "Testing build process..."
    if npm run build; then
        print_status "✅ Local build successful!"
        return 0
    else
        print_error "❌ Local build failed!"
        return 1
    fi
}

# Main setup function
main() {
    print_header "KNX Store Universal WooCommerce Setup"
    echo ""

    # Check if .env already exists
    if [ -f .env ]; then
        print_warning ".env file already exists. Do you want to overwrite it?"
        read -p "Continue? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_status "Setup cancelled."
            exit 0
        fi
    fi

    # Get WooCommerce details
    print_header "Step 1: WooCommerce Configuration"
    echo ""

    read -p "Enter your WooCommerce store URL (e.g., https://yourstore.com): " wc_url
    read -p "Enter WooCommerce Consumer Key: " wc_key
    read -p "Enter WooCommerce Consumer Secret: " wc_secret

    # Validate inputs
    if [ -z "$wc_url" ] || [ -z "$wc_key" ] || [ -z "$wc_secret" ]; then
        print_error "All WooCommerce details are required!"
        exit 1
    fi

    # Construct API URL
    wc_api_url="${wc_url%/}/wp-json/wc/v3"

    # Validate WooCommerce API
    if ! validate_woocommerce_api "$wc_api_url" "$wc_key" "$wc_secret"; then
        print_error "Please check your WooCommerce credentials and try again."
        print_status "Need help getting WooCommerce API credentials?"
        echo "1. Go to WooCommerce > Settings > Advanced > REST API"
        echo "2. Click 'Add key'"
        echo "3. Set permissions to 'Read/Write'"
        echo "4. Copy the Consumer Key and Consumer Secret"
        exit 1
    fi

    # Optional Redis setup
    print_header "Step 2: Redis Configuration (Optional)"
    echo ""
    print_status "Redis is optional but recommended for better performance."
    read -p "Do you have Upstash Redis? (y/N): " -n 1 -r
    echo

    redis_url=""
    redis_token=""

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter Upstash Redis URL: " redis_url
        read -p "Enter Upstash Redis Token: " redis_token
    fi

    # Create .env file
    create_env_file "$wc_api_url" "$wc_key" "$wc_secret" "$redis_url" "$redis_token"

    # Test local build
    if test_local_build; then
        print_status "✅ Local build test passed!"
    else
        print_warning "⚠️  Local build failed, but this might be expected if dependencies are missing."
        print_status "You can still proceed with Vercel deployment."
    fi

    # Setup Vercel
    read -p "Do you want to setup Vercel environment variables? (y/N): " -n 1 -r
    echo

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        setup_vercel_env
    fi

    # Final instructions
    print_header "🎉 Setup Complete!"
    echo ""
    print_status "Your KNX Store is now configured to work with:"
    echo "  Store URL: $wc_url"
    echo "  API URL: $wc_api_url"
    echo ""

    print_header "Next Steps:"
    echo ""
    echo "1. 🌐 Deploy to Vercel:"
    echo "   vercel --prod"
    echo ""

    echo "2. 🔧 Configure additional settings in Vercel dashboard:"
    echo "   - Set custom domain (optional)"
    echo "   - Configure environment variables (if not done automatically)"
    echo "   - Set up build hooks (optional)"
    echo ""

    echo "3. 🎨 Customize your store:"
    echo "   - Update branding in src/components/"
    echo "   - Modify translations in src/i18n/"
    echo "   - Customize styling in tailwind.config.mjs"
    echo ""

    echo "4. 📊 Optional integrations:"
    echo "   - Set up Stripe for payments"
    echo "   - Configure SendGrid for emails"
    echo "   - Add Google Analytics"
    echo ""

    print_status "For support and documentation, visit:"
    echo "https://github.com/hessam/knx-store-docker"
    echo ""

    print_status "Happy selling! 🛒✨"
}

# Run main function
main "$@"</content>
<parameter name="filePath">/Users/hessammousavi/Documents/GitHub/knx-store-docker/setup-woocommerce.sh

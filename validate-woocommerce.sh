#!/bin/bash

# WooCommerce Connection Validator for KNX Store
# This script validates WooCommerce API connection and tests all features

set -e

echo "🔍 KNX Store - WooCommerce Connection Validator"
echo "==============================================="

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

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_failed() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to test API endpoint
test_api_endpoint() {
    local url=$1
    local method=$2
    local expected_code=$3
    local description=$4

    echo -n "Testing $description... "

    local response=$(curl -s -w "\n%{http_code}" \
        -X "$method" \
        -u "${WOOCOMMERCE_CONSUMER_KEY}:${WOOCOMMERCE_CONSUMER_SECRET}" \
        "$url" 2>/dev/null)

    local http_code=$(echo "$response" | tail -n1)
    local api_response=$(echo "$response" | head -n -1)

    if [ "$http_code" = "$expected_code" ]; then
        print_success "PASSED (HTTP $http_code)"
        return 0
    else
        print_failed "FAILED (HTTP $http_code)"
        echo "Response: $api_response"
        return 1
    fi
}

# Function to validate environment variables
validate_environment() {
    print_header "1. Environment Variables Validation"
    echo ""

    local missing_vars=()

    # Required variables
    if [ -z "$WOOCOMMERCE_API_URL" ]; then
        missing_vars+=("WOOCOMMERCE_API_URL")
    fi

    if [ -z "$WOOCOMMERCE_CONSUMER_KEY" ]; then
        missing_vars+=("WOOCOMMERCE_CONSUMER_KEY")
    fi

    if [ -z "$WOOCOMMERCE_CONSUMER_SECRET" ]; then
        missing_vars+=("WOOCOMMERCE_CONSUMER_SECRET")
    fi

    if [ ${#missing_vars[@]} -gt 0 ]; then
        print_error "Missing required environment variables:"
        printf '  - %s\n' "${missing_vars[@]}"
        print_error "Please set these in your .env file or Vercel environment variables."
        return 1
    fi

    print_success "All required environment variables are set!"
    echo "  WOOCOMMERCE_API_URL: ${WOOCOMMERCE_API_URL:0:50}..."
    echo "  WOOCOMMERCE_CONSUMER_KEY: ${WOOCOMMERCE_CONSUMER_KEY:0:10}..."
    echo "  WOOCOMMERCE_CONSUMER_SECRET: ${WOOCOMMERCE_CONSUMER_SECRET:0:10}..."

    # Optional variables
    if [ -n "$UPSTASH_REDIS_REST_URL" ]; then
        print_success "Redis caching is configured"
    else
        print_warning "Redis not configured - caching will be disabled"
    fi

    return 0
}

# Function to test WooCommerce API connectivity
test_api_connectivity() {
    print_header "2. WooCommerce API Connectivity Test"
    echo ""

    local api_url="${WOOCOMMERCE_API_URL%/}"

    # Test basic connectivity
    if test_api_endpoint "${api_url}/products?per_page=1" "GET" "200" "Products endpoint"; then
        print_success "Basic API connectivity test passed!"
    else
        print_error "Basic API connectivity test failed!"
        return 1
    fi

    # Test categories endpoint
    test_api_endpoint "${api_url}/products/categories?per_page=1" "GET" "200" "Categories endpoint"

    # Test system status
    test_api_endpoint "${api_url}/system_status" "GET" "200" "System status endpoint"

    return 0
}

# Function to test data retrieval
test_data_retrieval() {
    print_header "3. Data Retrieval Test"
    echo ""

    local api_url="${WOOCOMMERCE_API_URL%/}"

    # Get sample product data
    echo -n "Fetching sample product data... "

    local response=$(curl -s \
        -u "${WOOCOMMERCE_CONSUMER_KEY}:${WOOCOMMERCE_CONSUMER_SECRET}" \
        "${api_url}/products?per_page=3" 2>/dev/null)

    if [ -z "$response" ] || [ "$response" = "[]" ]; then
        print_failed "FAILED - No products found"
        print_warning "Your WooCommerce store appears to have no products."
        print_status "Please add some products to test the integration."
        return 1
    fi

    local product_count=$(echo "$response" | jq length 2>/dev/null || echo "unknown")
    print_success "PASSED - Found $product_count products"

    # Display sample product info
    echo "$response" | jq '.[0] | {id: .id, name: .name, status: .status, price: .price, images: (.images | length)}' 2>/dev/null || echo "Sample product data: $response"

    return 0
}

# Function to test build process
test_build_process() {
    print_header "4. Build Process Test"
    echo ""

    # Check if ALLOW_BUILD_WITHOUT_API is set
    if [ "$ALLOW_BUILD_WITHOUT_API" = "true" ]; then
        print_success "ALLOW_BUILD_WITHOUT_API is set to true - build will use fallback data if API fails"
    else
        print_warning "ALLOW_BUILD_WITHOUT_API is not set to true - build may fail if API is unavailable"
    fi

    # Test if we can import the WooCommerce sync module
    echo -n "Testing WooCommerce sync module import... "

    if node -e "
        try {
            process.env.WOOCOMMERCE_API_URL = '$WOOCOMMERCE_API_URL';
            process.env.WOOCOMMERCE_CONSUMER_KEY = '$WOOCOMMERCE_CONSUMER_KEY';
            process.env.WOOCOMMERCE_CONSUMER_SECRET = '$WOOCOMMERCE_CONSUMER_SECRET';
            process.env.ALLOW_BUILD_WITHOUT_API = '$ALLOW_BUILD_WITHOUT_API';

            const { getWooCommerceSync } = require('./src/lib/api/woocommerce-sync.ts');
            console.log('✅ Module import successful');
        } catch (error) {
            console.error('❌ Module import failed:', error.message);
            process.exit(1);
        }
    " 2>/dev/null; then
        print_success "PASSED - WooCommerce sync module imports correctly"
    else
        print_failed "FAILED - WooCommerce sync module import failed"
        return 1
    fi

    return 0
}

# Function to test Redis connectivity (if configured)
test_redis_connectivity() {
    if [ -z "$UPSTASH_REDIS_REST_URL" ] || [ -z "$UPSTASH_REDIS_REST_TOKEN" ]; then
        print_header "5. Redis Connectivity Test"
        print_warning "Redis not configured - skipping test"
        return 0
    fi

    print_header "5. Redis Connectivity Test"
    echo ""

    echo -n "Testing Redis connection... "

    local response=$(curl -s -w "\n%{http_code}" \
        -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN" \
        "$UPSTASH_REDIS_REST_URL/ping" 2>/dev/null)

    local http_code=$(echo "$response" | tail -n1)

    if [ "$http_code" = "200" ]; then
        print_success "PASSED - Redis connection successful"
    else
        print_failed "FAILED - Redis connection failed (HTTP $http_code)"
        print_warning "Caching will be disabled, but the app will still work"
    fi

    return 0
}

# Function to generate report
generate_report() {
    print_header "📊 Validation Report"
    echo ""

    echo "Environment: $(date)"
    echo "Node Version: $(node --version)"
    echo "NPM Version: $(npm --version)"
    echo ""

    echo "WooCommerce Configuration:"
    echo "  API URL: ${WOOCOMMERCE_API_URL:0:50}..."
    echo "  Consumer Key: ${WOOCOMMERCE_CONSUMER_KEY:0:10}..."
    echo "  Redis Enabled: $([ -n "$UPSTASH_REDIS_REST_URL" ] && echo 'Yes' || echo 'No')"
    echo ""

    echo "Next Steps:"
    if [ "$validation_passed" = "true" ]; then
        echo "  ✅ Your WooCommerce integration is ready!"
        echo "  🚀 You can now deploy to Vercel or run locally"
        echo "  📖 Check the README.md for deployment instructions"
    else
        echo "  ❌ Please fix the issues above before deploying"
        echo "  🆘 Check the troubleshooting section in README.md"
    fi
    echo ""
}

# Main validation function
main() {
    local validation_passed=true

    # Load environment variables
    if [ -f .env ]; then
        print_status "Loading environment variables from .env file..."
        export $(grep -v '^#' .env | xargs)
    fi

    # Run all validation tests
    if ! validate_environment; then
        validation_passed=false
    fi

    if ! test_api_connectivity; then
        validation_passed=false
    fi

    if ! test_data_retrieval; then
        validation_passed=false
    fi

    if ! test_build_process; then
        validation_passed=false
    fi

    test_redis_connectivity

    # Generate report
    generate_report

    if [ "$validation_passed" = "true" ]; then
        print_success "🎉 All validation tests passed!"
        return 0
    else
        print_error "❌ Some validation tests failed. Please fix the issues above."
        return 1
    fi
}

# Run main function
main "$@"</content>
<parameter name="filePath">/Users/hessammousavi/Documents/GitHub/knx-store-docker/validate-woocommerce.sh

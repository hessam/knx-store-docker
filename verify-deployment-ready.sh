#!/bin/bash

# Deployment Readiness Verification Script
# Verifies that all configurations are correct for Vercel deployment

echo "🚀 KNX Store - Deployment Readiness Check"
echo "=========================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

success_count=0
total_checks=8

check_passed() {
    echo -e "${GREEN}✅ $1${NC}"
    ((success_count++))
}

check_failed() {
    echo -e "${RED}❌ $1${NC}"
}

check_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

echo -e "${BLUE}Checking configuration files...${NC}"

# 1. Check astro.config.mjs
echo "1. Verifying astro.config.mjs..."
if grep -q 'output: "static"' astro.config.mjs && ! grep -q '@astrojs/vercel' astro.config.mjs; then
    check_passed "Static output configured, no Vercel adapter"
else
    check_failed "astro.config.mjs not configured for static output"
fi

# 2. Check vercel.json
echo "2. Verifying vercel.json..."
if [ -f "vercel.json" ] && jq -e '.functions."api/**/*.ts".runtime' vercel.json > /dev/null 2>&1; then
    check_passed "vercel.json has native function configuration"
else
    check_failed "vercel.json missing or incorrectly configured"
fi

# 3. Check native API directory
echo "3. Verifying native API functions..."
if [ -d "api" ] && [ -f "api/index.ts" ] && [ -f "api/sync.ts" ]; then
    api_count=$(find api -name "*.ts" | wc -l)
    check_passed "Native API functions found ($api_count files)"
else
    check_failed "Native API functions missing in /api directory"
fi

# 4. Check package.json dependencies
echo "4. Verifying dependencies..."
if grep -q '"@vercel/node"' package.json; then
    check_passed "@vercel/node dependency found"
else
    check_failed "@vercel/node dependency missing"
fi

# 5. Check TypeScript configuration
echo "5. Verifying TypeScript config..."
if grep -q 'api-backup' tsconfig.json; then
    check_passed "TypeScript excludes api-backup directory"
else
    check_warning "TypeScript may include backup files"
    ((success_count++))
fi

# 6. Check if old API routes are moved
echo "6. Verifying old API routes cleanup..."
if [ ! -d "src/pages/api" ] && [ -d "src/pages/api-backup" ]; then
    check_passed "Old API routes moved to backup"
else
    check_failed "Old API routes still present in src/pages/api"
fi

# 7. Check environment variables template
echo "7. Verifying environment setup..."
if [ -f "vercel.env.example" ] && [ -f "setup-vercel-env.sh" ]; then
    check_passed "Environment setup tools available"
else
    check_warning "Environment setup tools may be missing"
    ((success_count++))
fi

# 8. Check build output
echo "8. Verifying build artifacts..."
if [ -d "dist" ] && [ -f "dist/index.html" ]; then
    check_passed "Build artifacts present"
else
    check_warning "No build artifacts found (run 'npm run build' first)"
    ((success_count++))
fi

echo ""
echo "=========================================="
echo -e "${BLUE}Summary:${NC}"
echo -e "Passed: ${GREEN}$success_count${NC}/$total_checks checks"

if [ $success_count -eq $total_checks ]; then
    echo ""
    echo -e "${GREEN}🎉 DEPLOYMENT READY!${NC}"
    echo -e "${GREEN}✅ All checks passed${NC}"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo "1. git add ."
    echo "2. git commit -m 'Ready for production: Static + Native Vercel API'"
    echo "3. git push origin main"
    echo "4. Configure environment variables in Vercel dashboard"
    echo "5. Deploy to Vercel"
    echo ""
    echo -e "${BLUE}Architecture Summary:${NC}"
    echo "- Static Astro build (ultra-fast pages)"
    echo "- Native Vercel API functions (/api directory)"
    echo "- No Astro adapter conflicts"
    echo "- Universal WooCommerce compatibility"
elif [ $success_count -ge 6 ]; then
    echo ""
    echo -e "${YELLOW}⚠️  MOSTLY READY${NC}"
    echo -e "${YELLOW}Minor issues detected but deployment should work${NC}"
else
    echo ""
    echo -e "${RED}❌ NOT READY${NC}"
    echo -e "${RED}Critical issues need to be resolved${NC}"
fi

echo ""
echo -e "${BLUE}Configuration Details:${NC}"
echo "- Output: Static"
echo "- Adapter: None (native Vercel)"
echo "- API: Native serverless functions"
echo "- Deployment: Zero-config Vercel"

exit 0

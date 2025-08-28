#!/bin/bash

# Quick Configuration Test for Vercel Deployment
echo "🔧 Testing Vercel deployment configuration..."
echo "============================================="

# Check imports in astro.config.mjs
echo "✅ Checking Astro configuration..."
if grep -q "from \"@astrojs/vercel\"" astro.config.mjs; then
    echo "✅ Using correct Vercel adapter import"
else
    echo "❌ Incorrect Vercel adapter import found"
    exit 1
fi

if grep -q "output.*hybrid" astro.config.mjs; then
    echo "✅ Using hybrid output mode"
else
    echo "❌ Not using hybrid output mode"
    exit 1
fi

# Check API routes have prerender = false
echo "✅ Checking API routes configuration..."
api_files_count=$(find src/pages/api -name "*.ts" | wc -l)
prerender_count=$(grep -r "export const prerender = false" src/pages/api --include="*.ts" | wc -l)

echo "   - API files found: $api_files_count"
echo "   - Files with prerender = false: $prerender_count"

if [ "$prerender_count" -gt 0 ]; then
    echo "✅ API routes configured for server-side rendering"
else
    echo "⚠️  No API routes have prerender = false (this may be OK)"
fi

# Check for problematic process handlers
echo "✅ Checking for serverless-incompatible code..."
if grep -r "process\.on" src/pages/api --include="*.ts" > /dev/null 2>&1; then
    echo "❌ Found process handlers in API routes (not compatible with serverless)"
    grep -r "process\.on" src/pages/api --include="*.ts"
    exit 1
else
    echo "✅ No problematic process handlers found"
fi

# Check vercel.json syntax
echo "✅ Checking vercel.json..."
if [ -f "vercel.json" ]; then
    if python3 -c "import json; json.load(open('vercel.json'))" 2>/dev/null; then
        echo "✅ vercel.json is valid JSON"
    else
        echo "❌ vercel.json has invalid JSON syntax"
        exit 1
    fi
    
    if grep -q "functions" vercel.json; then
        echo "❌ Found manual function configuration in vercel.json"
        echo "   Remove 'functions' section to let Astro handle it automatically"
        exit 1
    else
        echo "✅ No manual function configuration found"
    fi
else
    echo "✅ No vercel.json found (using Astro defaults)"
fi

echo ""
echo "🎉 Configuration test passed!"
echo "🚀 Ready for Vercel deployment"
echo ""
echo "To deploy:"
echo "1. git add ."
echo "2. git commit -m \"Fix Vercel adapter and configuration\""
echo "3. git push origin main"

#!/bin/bash

# Quick Configuration Test for Vercel Deployment
echo "🔧 Testing Vercel deployment configuration..."
echo "============================================="

# Check Astro configuration
echo "✅ Checking Astro configuration..."
if grep -q "output.*static" astro.config.mjs; then
    echo "✅ Using static output mode"
else
    echo "❌ Not using static output mode"
    exit 1
fi

# Check API routes structure
echo "✅ Checking API routes configuration..."
if [ -d "api" ]; then
    api_files_count=$(find api -name "*.ts" | wc -l)
    echo "   - API files found in /api: $api_files_count"
    echo "✅ Using Vercel native API routes"
else
    echo "❌ No /api directory found"
    exit 1
fi

# Check vercel.json configuration
echo "✅ Checking vercel.json..."
if [ -f "vercel.json" ]; then
    if python3 -c "import json; json.load(open('vercel.json'))" 2>/dev/null; then
        echo "✅ vercel.json is valid JSON"
    else
        echo "❌ vercel.json has invalid JSON syntax"
        exit 1
    fi
    
    if grep -q "functions" vercel.json && grep -q "api/\*\*/\*.ts" vercel.json; then
        echo "✅ API functions properly configured"
    else
        echo "❌ API functions not properly configured in vercel.json"
        exit 1
    fi
else
    echo "❌ vercel.json not found"
    exit 1
fi

# Check for @vercel/node dependency
echo "✅ Checking dependencies..."
if grep -q "@vercel/node" package.json; then
    echo "✅ @vercel/node dependency found"
else
    echo "❌ @vercel/node dependency missing"
    exit 1
fi

echo ""
echo "🎉 Configuration test passed!"
echo "🚀 Ready for Vercel deployment with native API routes"
echo ""
echo "To deploy:"
echo "1. git add ."
echo "2. git commit -m \"Use static Astro with native Vercel API routes\""
echo "3. git push origin main"

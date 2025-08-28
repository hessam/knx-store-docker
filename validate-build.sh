#!/bin/bash

# Build Validation Script for KNX Store
# This script validates that the project builds correctly before deployment

echo "🔍 Validating KNX Store build process..."
echo "========================================"

# Check if package.json is valid JSON
echo "✅ Checking package.json syntax..."
if ! node -e "JSON.parse(require('fs').readFileSync('package.json', 'utf8'))"; then
    echo "❌ package.json has invalid JSON syntax"
    exit 1
fi
echo "✅ package.json is valid"

# Check if vercel.json is valid JSON
echo "✅ Checking vercel.json syntax..."
if ! node -e "JSON.parse(require('fs').readFileSync('vercel.json', 'utf8'))"; then
    echo "❌ vercel.json has invalid JSON syntax"
    exit 1
fi
echo "✅ vercel.json is valid"

# Check if astro.config.mjs is valid JavaScript
echo "✅ Checking astro.config.mjs syntax..."
if ! node -c astro.config.mjs; then
    echo "❌ astro.config.mjs has syntax errors"
    exit 1
fi
echo "✅ astro.config.mjs is valid"

# Install dependencies
echo "📦 Installing dependencies..."
if ! npm install --legacy-peer-deps; then
    echo "❌ Failed to install dependencies"
    exit 1
fi
echo "✅ Dependencies installed successfully"

# Run type check
echo "🔍 Running TypeScript type check..."
if ! npm run type-check; then
    echo "❌ TypeScript type check failed"
    exit 1
fi
echo "✅ TypeScript type check passed"

# Run build
echo "🏗️  Building project..."
if ! npm run build; then
    echo "❌ Build failed"
    exit 1
fi
echo "✅ Build completed successfully"

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo "❌ dist directory not found after build"
    exit 1
fi
echo "✅ dist directory created"

echo ""
echo "🎉 Build validation completed successfully!"
echo "The project is ready for Vercel deployment."
echo ""
echo "Next steps:"
echo "1. Commit your changes: git add . && git commit -m 'Fix build issues'"
echo "2. Push to Vercel: git push origin main"
echo "3. Or deploy directly: vercel --prod"

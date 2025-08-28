#!/bin/bash

# Clear Vercel deployment and redeploy with correct configuration
echo "🔧 Fixing Vercel PHP Runtime Error"
echo "=================================="

echo "1. This project is Node.js/TypeScript, not PHP"
echo "2. Current vercel.json is correctly configured for Node.js"
echo "3. The PHP error suggests Vercel is confused about the project type"

echo ""
echo "📋 Steps to fix:"
echo "1. Go to Vercel Dashboard → Your Project → Settings"
echo "2. Check 'Functions' section - ensure no PHP configurations"
echo "3. Check 'Environment Variables' - ensure Node.js environment"
echo "4. In 'General' settings, verify Framework is set to 'Astro'"

echo ""
echo "🚀 Quick fix commands:"
echo "git add ."
echo "git commit -m 'Fix: Ensure Node.js runtime configuration'"
echo "git push origin main"

echo ""
echo "📄 Current vercel.json configuration (correct for Node.js):"
cat vercel.json

echo ""
echo "✅ If you still see PHP errors:"
echo "1. Delete the project from Vercel dashboard"
echo "2. Re-import from GitHub"
echo "3. Ensure 'Framework Preset' is set to 'Astro'"

echo ""
echo "🎯 This is a Node.js project with TypeScript API functions!"

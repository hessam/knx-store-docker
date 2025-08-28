#!/bin/bash

# Fix Astro redirects for static build mode
echo "🔧 Fixing Astro redirects for static build mode"
echo "================================================"

# List of files that need to be converted from Astro.redirect to meta redirects
declare -A redirect_files=(
    ["src/pages/contact.astro"]="/en/contact"
    ["src/pages/checkout.astro"]="/en/checkout"
    ["src/pages/login.astro"]="/en/login"
    ["src/pages/products/catalog-optimized.astro"]="/en/products/catalog-optimized"
)

for file in "${!redirect_files[@]}"; do
    destination="${redirect_files[$file]}"
    echo "Fixing $file -> $destination"
    
    # Create the meta redirect version
    cat > "$file" << EOF
---
// Static redirect page
import Layout from '../layouts/Layout.astro';
---

<Layout title="Redirecting...">
  <head>
    <meta http-equiv="refresh" content="0; url=$destination" />
    <link rel="canonical" href="$destination" />
  </head>
  
  <main>
    <div style="text-align: center; padding: 2rem;">
      <h1>Redirecting...</h1>
      <p>If you are not redirected automatically, <a href="$destination">click here</a>.</p>
    </div>
  </main>
  
  <script>
    if (typeof window !== 'undefined') {
      window.location.href = '$destination';
    }
  </script>
</Layout>
EOF
done

echo ""
echo "✅ Fixed redirect pages for static build mode"
echo "✅ All pages now use meta redirects instead of Astro.redirect()"
echo "✅ Added JavaScript fallback redirects"

echo ""
echo "📋 Updated files:"
for file in "${!redirect_files[@]}"; do
    echo "- $file"
done

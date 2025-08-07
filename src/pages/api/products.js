export async function GET({ request }) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const perPage = parseInt(url.searchParams.get('per_page') || '20');
  const search = url.searchParams.get('search') || '';
  
  // Simulate 1000+ products for infinite scroll testing
  const totalProducts = 1000;
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  
  // Generate simulated products
  const products = [];
  for (let i = startIndex; i < endIndex && i < totalProducts; i++) {
    const product = {
      id: i + 1,
      name: `KNX Smart Product ${i + 1}`,
      description: `High-performance KNX smart building solution ${i + 1}. This product offers advanced automation capabilities for modern smart buildings.`,
      price: (99.99 + (i * 10)).toFixed(2),
      regular_price: (99.99 + (i * 10)).toFixed(2),
      sale_price: '',
      permalink: `https://mohtavaly.com/product/knx-smart-product-${i + 1}/`,
      slug: `knx-smart-product-${i + 1}`,
      images: [{
        id: i + 1,
        src: `https://picsum.photos/300/300?random=${i + 1}`,
        name: `Product ${i + 1}`,
        alt: `KNX Smart Product ${i + 1}`
      }],
      categories: [{
        id: 1,
        name: 'KNX Products',
        slug: 'knx-products'
      }],
      stock_status: 'instock',
      on_sale: false,
      featured: i % 10 === 0, // Every 10th product is featured
      average_rating: (4.0 + (Math.random() * 1.0)).toFixed(1),
      rating_count: Math.floor(Math.random() * 50) + 1
    };
    
    // Apply search filter if provided
    if (search && !product.name.toLowerCase().includes(search.toLowerCase())) {
      continue;
    }
    
    products.push(product);
  }
  
  // Add cache headers for better performance
  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  
  return new Response(JSON.stringify({
    products,
    pagination: {
      page,
      per_page: perPage,
      total: totalProducts,
      total_pages: Math.ceil(totalProducts / perPage),
      has_next: page < Math.ceil(totalProducts / perPage),
      has_prev: page > 1
    },
    meta: {
      generated_at: new Date().toISOString(),
      simulated: true,
      total_products: totalProducts
    }
  }), {
    status: 200,
    headers
  });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
} 
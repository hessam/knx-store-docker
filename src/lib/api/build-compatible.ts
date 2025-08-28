/**
 * Simple Build-Compatible API Libraries
 * These will work in both build time and runtime
 */

// For build compatibility, we'll make all Redis functionality optional
export async function getPriceStockData(ids: string[]) {
  try {
    // Use the existing sync API for price/stock data
    const response = await fetch('/api/sync?action=price-stock&productIds=' + ids.join(','));

    if (!response.ok) {
      throw new Error(`Price/stock sync failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }

    return data.data || ids.map(id => ({
      productId: id,
      price: '0.00',
      stock: 0,
      inStock: false,
      cached: false,
      lastUpdated: new Date().toISOString(),
      error: 'Product not found'
    }));

  } catch (error) {
    console.error('Price/stock API error:', error);
    return ids.map(id => ({
      productId: id,
      price: '0.00',
      stock: 0,
      inStock: false,
      cached: false,
      lastUpdated: new Date().toISOString(),
      error: 'API temporarily unavailable'
    }));
  }
}

export async function getCartManager() {
  // Simplified cart manager for build compatibility
  return {
    getCart: async (sessionId: string) => ({
      sessionId,
      items: [],
      total: '0.00',
      itemCount: 0,
      lastUpdated: new Date().toISOString(),
      currency: 'USD'
    }),
    addItem: async (sessionId: string, item: any) => ({
      sessionId,
      items: [item],
      total: item.price || '0.00',
      itemCount: 1,
      lastUpdated: new Date().toISOString(),
      currency: 'USD'
    }),
    updateItem: async (_sessionId: string, _productId: string, _quantity: number) => ({
      sessionId: _sessionId,
      items: [],
      total: '0.00',
      itemCount: 0,
      lastUpdated: new Date().toISOString(),
      currency: 'USD'
    }),
    removeItem: async (_sessionId: string, _productId: string) => ({
      sessionId: _sessionId,
      items: [],
      total: '0.00',
      itemCount: 0,
      lastUpdated: new Date().toISOString(),
      currency: 'USD'
    }),
    clearCart: async (_sessionId: string) => true
  };
}

export async function performProductSearch(options: any) {
  try {
    // Use the existing WooCommerce client from our API
    const response = await fetch('/api/sync?action=products&' + new URLSearchParams({
      search: options.q || '',
      category: options.category || '',
      featured: options.featured ? 'true' : '',
      per_page: options.per_page || '24',
      page: options.page || '1',
      orderby: options.sort || 'title',
      order: 'asc'
    }));

    if (!response.ok) {
      throw new Error(`WooCommerce sync failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }

    // Transform the response to match expected format
    const products = data.products || [];
    
    const transformedProducts = products.map((product: any) => ({
      id: product.id.toString(),
      productId: product.id.toString(),
      name: product.name,
      slug: product.slug,
      price: product.price || product.regular_price || '0.00',
      regular_price: product.regular_price || '0.00',
      sale_price: product.sale_price,
      on_sale: product.on_sale || false,
      image: product.images?.[0]?.src || null,
      category: product.categories?.[0]?.name || 'uncategorized',
      description: product.short_description || product.description || '',
      inStock: product.stock_status === 'instock',
      stock_status: product.stock_status,
      featured: product.featured || false,
      rating: parseFloat(product.average_rating || '0'),
      rating_count: parseInt(product.rating_count || '0'),
      relevanceScore: 1.0
    }));

    return {
      results: transformedProducts,
      total: transformedProducts.length,
      cached: data.cached || false,
      suggestions: transformedProducts.length === 0 ? ['Try different search terms', 'Check spelling', 'Browse categories'] : []
    };

  } catch (error) {
    console.error('Product search error:', error);
    
    // Return empty results with error info
    return {
      results: [],
      total: 0,
      cached: false,
      suggestions: ['WooCommerce API temporarily unavailable', 'Please try again later'],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

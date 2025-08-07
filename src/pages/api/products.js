import { getWooCommerceSync } from '../../lib/api/woocommerce-sync';

export async function GET({ request }) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const perPage = parseInt(url.searchParams.get('per_page') || '20');
    const search = url.searchParams.get('search') || '';
    
    const wooCommerceSync = getWooCommerceSync();
    
    // Fetch products with pagination
    const products = await wooCommerceSync.fetchProducts({
      page,
      per_page: perPage,
      search: search || undefined
    });
    
    return new Response(JSON.stringify(products), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch products',
      message: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
} 
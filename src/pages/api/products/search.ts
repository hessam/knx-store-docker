// Redirect to the main search API
export const GET = async ({ request }: any) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams.toString();
  
  // Redirect to the main search API
  const searchUrl = `/api/search${searchParams ? '?' + searchParams : ''}`;
  
  try {
    // Fetch from the main search API
    const response = await fetch(new URL(searchUrl, url.origin).toString());
    const data = await response.json();
    
    // Transform the response to match what the catalog expects
    const transformedData = {
      products: data.results || [],
      total: data.total || 0,
      page: parseInt(url.searchParams.get('page') || '1'),
      per_page: parseInt(url.searchParams.get('per_page') || '24'),
      total_pages: Math.ceil((data.total || 0) / parseInt(url.searchParams.get('per_page') || '24')),
      has_more: data.results && data.results.length > 0,
      search_time_ms: data.metadata?.responseTime || 0,
      query: url.searchParams.get('q') || '',
      suggestions: data.suggestions || [],
      metadata: data.metadata || {}
    };
    
    return new Response(JSON.stringify(transformedData), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300' // 5 minutes
      }
    });
  } catch (error) {
    console.error('Products search redirect error:', error);
    
    return new Response(JSON.stringify({
      error: 'Search service unavailable',
      products: [],
      total: 0,
      page: 1,
      per_page: 24,
      total_pages: 0,
      has_more: false,
      search_time_ms: 0,
      query: '',
      suggestions: [],
      metadata: {
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  }
};

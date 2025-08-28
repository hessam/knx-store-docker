import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Fast Product Search API
 * Target: <300ms response time
 * Features: Intelligent search, caching, fuzzy matching
 */

interface SearchResult {
  productId: string;
  name: string;
  slug: string;
  price: string;
  salePrice?: string;
  image?: string;
  category?: string;
  inStock: boolean;
  relevanceScore: number;
}

interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
  suggestions?: string[];
  metadata: {
    responseTime: number;
    cached: boolean;
    timestamp: string;
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const startTime = Date.now();
  
  // CORS and performance headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=600'); // 5min browser, 10min CDN
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { q, limit = '20', category, minPrice, maxPrice, inStock } = req.query;
    
    if (!q || typeof q !== 'string' || q.trim().length < 2) {
      res.status(400).json({ error: 'Search query must be at least 2 characters' });
      return;
    }
    
    const searchLimit = Math.min(parseInt(limit as string) || 20, 50);
    
    // Dynamic import to avoid build issues
    const { performProductSearch } = await import('../../src/lib/api/product-search');
    
    const searchResults = await performProductSearch({
      query: q.trim(),
      limit: searchLimit,
      category: category as string,
      minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
      inStock: inStock === 'true'
    });
    
    const responseTime = Date.now() - startTime;
    
    const response: SearchResponse = {
      results: searchResults.results,
      total: searchResults.total,
      query: q.trim(),
      suggestions: searchResults.suggestions,
      metadata: {
        responseTime,
        cached: searchResults.cached,
        timestamp: new Date().toISOString()
      }
    };
    
    res.status(200).json(response);
    
  } catch (error) {
    console.error('Search API Error:', error);
    
    const responseTime = Date.now() - startTime;
    
    res.status(500).json({ 
      error: 'Search failed',
      metadata: {
        responseTime,
        timestamp: new Date().toISOString()
      }
    });
  }
}

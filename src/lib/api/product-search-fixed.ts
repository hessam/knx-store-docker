/**
 * Product Search Engine
 * Optimized for sub-300ms response times
 * Features: Fuzzy matching, caching, intelligent relevance scoring
 */

// Node.js compatibility for Vercel functions
declare const process: any;
declare const Buffer: any;

interface SearchOptions {
  query: string;
  limit: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

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

interface SearchResults {
  results: SearchResult[];
  total: number;
  cached: boolean;
  suggestions?: string[];
}

interface RedisInstance {
  get: (key: string) => Promise<string | null>;
  setex: (key: string, ttl: number, value: string) => Promise<string>;
  del: (key: string) => Promise<number>;
}

let redisInstance: RedisInstance | null = null;

async function getRedis(): Promise<RedisInstance | null> {
  if (redisInstance) return redisInstance;
  
  try {
    // Dynamic import for Upstash Redis
    const RedisModule = await import('@upstash/redis');
    const { Redis } = RedisModule;
    
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      console.warn('[Product Search] Redis not configured, using direct search');
      return null;
    }
    
    redisInstance = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    
    return redisInstance;
  } catch (error) {
    console.error('[Product Search] Redis connection failed:', error);
    return null;
  }
}

function calculateRelevanceScore(product: any, query: string): number {
  const searchTerm = query.toLowerCase();
  const name = (product.name || '').toLowerCase();
  const description = (product.short_description || '').toLowerCase();
  const categories = product.categories?.map((cat: any) => cat.name.toLowerCase()).join(' ') || '';
  
  let score = 0;
  
  // Exact name match
  if (name === searchTerm) score += 100;
  
  // Name starts with query
  if (name.startsWith(searchTerm)) score += 80;
  
  // Name contains query
  if (name.includes(searchTerm)) score += 60;
  
  // Description contains query
  if (description.includes(searchTerm)) score += 40;
  
  // Category match
  if (categories.includes(searchTerm)) score += 30;
  
  // Fuzzy matching - count matching words
  const queryWords = searchTerm.split(' ');
  const nameWords = name.split(' ');
  const matchingWords = queryWords.filter(word => 
    nameWords.some((nameWord: string) => nameWord.includes(word) || word.includes(nameWord))
  );
  score += (matchingWords.length / queryWords.length) * 20;
  
  return score;
}

async function searchWooCommerceProducts(options: SearchOptions): Promise<SearchResult[]> {
  try {
    let apiUrl = `${process.env.WOOCOMMERCE_API_URL}/products?search=${encodeURIComponent(options.query)}&per_page=${options.limit}&status=publish`;
    
    // Add filters
    if (options.category) {
      apiUrl += `&category=${options.category}`;
    }
    
    if (options.minPrice || options.maxPrice) {
      if (options.minPrice) apiUrl += `&min_price=${options.minPrice}`;
      if (options.maxPrice) apiUrl += `&max_price=${options.maxPrice}`;
    }
    
    if (options.inStock) {
      apiUrl += `&stock_status=instock`;
    }
    
    const auth = Buffer.from(`${process.env.WOOCOMMERCE_CONSUMER_KEY}:${process.env.WOOCOMMERCE_CONSUMER_SECRET}`).toString('base64');
    
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      // Add timeout to ensure sub-300ms target
      signal: AbortSignal.timeout(250)
    });
    
    if (!response.ok) {
      throw new Error(`WooCommerce API error: ${response.status}`);
    }
    
    const products = await response.json();
    
    // Calculate relevance scores and sort
    const resultsWithScore = products.map((product: any) => ({
      productId: product.id.toString(),
      name: product.name,
      slug: product.slug,
      price: product.price || '0',
      salePrice: product.sale_price || undefined,
      image: product.images?.[0]?.src || undefined,
      category: product.categories?.[0]?.name || undefined,
      inStock: product.stock_status === 'instock',
      relevanceScore: calculateRelevanceScore(product, options.query)
    }));
    
    // Sort by relevance score (highest first)
    return resultsWithScore.sort((a: SearchResult, b: SearchResult) => b.relevanceScore - a.relevanceScore);
    
  } catch (error) {
    console.error('[Product Search] WooCommerce search failed:', error);
    return [];
  }
}

export async function performProductSearch(options: SearchOptions): Promise<SearchResults> {
  const redis = await getRedis();
  
  // Create cache key
  const cacheKey = `search:${JSON.stringify(options)}`;
  
  // Try to get from cache first
  if (redis) {
    try {
      const cachedResult = await redis.get(cacheKey);
      if (cachedResult) {
        const parsed = JSON.parse(cachedResult);
        return {
          ...parsed,
          cached: true
        };
      }
    } catch (error) {
      console.error('[Product Search] Cache read error:', error);
    }
  }
  
  // Perform search
  const results = await searchWooCommerceProducts(options);
  
  // Generate suggestions (mock implementation)
  const suggestions = results.length > 0 ? [] : [`${options.query} products`, `${options.query} alternatives`];
  
  const searchResults: SearchResults = {
    results,
    total: results.length,
    cached: false,
    suggestions
  };
  
  // Cache the results for 5 minutes
  if (redis) {
    try {
      await redis.setex(cacheKey, 300, JSON.stringify(searchResults));
    } catch (error) {
      console.error('[Product Search] Cache write error:', error);
    }
  }
  
  return searchResults;
}

// Export types
export type { SearchOptions, SearchResult, SearchResults };

/**
 * Price & Stock Data Manager
 * Optimized for sub-200ms response times
 */

interface PriceStockItem {
  productId: string;
  price: string;
  salePrice?: string;
  stock: number;
  inStock: boolean;
  cached: boolean;
  lastUpdated: string;
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
    const { Redis } = await import('@upstash/redis');
    
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      console.warn('[Price/Stock] Redis not configured, using direct API calls');
      return null;
    }
    
    redisInstance = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    
    return redisInstance;
  } catch (error) {
    console.error('[Price/Stock] Redis connection failed:', error);
    return null;
  }
}

async function fetchFromWooCommerce(productIds: string[]): Promise<PriceStockItem[]> {
  try {
    // Batch request to WooCommerce API
    const response = await fetch(`${process.env.WOOCOMMERCE_API_URL}/products?include=${productIds.join(',')}&per_page=20`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.WOOCOMMERCE_CONSUMER_KEY}:${process.env.WOOCOMMERCE_CONSUMER_SECRET}`).toString('base64')}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`WooCommerce API error: ${response.status}`);
    }
    
    const products = await response.json();
    
    return products.map((product: any): PriceStockItem => ({
      productId: product.id.toString(),
      price: product.price || product.regular_price || '0',
      salePrice: product.sale_price || undefined,
      stock: product.stock_quantity || 0,
      inStock: product.stock_status === 'instock',
      cached: false,
      lastUpdated: new Date().toISOString()
    }));
    
  } catch (error) {
    console.error('[Price/Stock] WooCommerce fetch failed:', error);
    throw error;
  }
}

export async function getPriceStockData(productIds: string[]): Promise<PriceStockItem[]> {
  const redis = await getRedis();
  const results: PriceStockItem[] = [];
  const uncachedIds: string[] = [];
  
  // Check Redis cache first
  if (redis) {
    for (const productId of productIds) {
      try {
        const cacheKey = `price_stock:${productId}`;
        const cached = await redis.get(cacheKey);
        
        if (cached) {
          const data = JSON.parse(cached);
          results.push({ ...data, cached: true });
        } else {
          uncachedIds.push(productId);
        }
      } catch (error) {
        console.error(`[Price/Stock] Cache read failed for ${productId}:`, error);
        uncachedIds.push(productId);
      }
    }
  } else {
    uncachedIds.push(...productIds);
  }
  
  // Fetch uncached data from WooCommerce
  if (uncachedIds.length > 0) {
    try {
      const freshData = await fetchFromWooCommerce(uncachedIds);
      
      // Cache the fresh data
      if (redis) {
        for (const item of freshData) {
          try {
            const cacheKey = `price_stock:${item.productId}`;
            // Cache prices for 5 minutes, stock for 1 minute (using shorter TTL)
            const ttl = 300; // 5 minutes
            await redis.setex(cacheKey, ttl, JSON.stringify(item));
          } catch (error) {
            console.error(`[Price/Stock] Cache write failed for ${item.productId}:`, error);
          }
        }
      }
      
      results.push(...freshData);
    } catch (error) {
      console.error('[Price/Stock] Failed to fetch fresh data:', error);
      
      // Return placeholder data for failed requests
      for (const productId of uncachedIds) {
        results.push({
          productId,
          price: '0',
          stock: 0,
          inStock: false,
          cached: false,
          lastUpdated: new Date().toISOString()
        });
      }
    }
  }
  
  // Sort results to match input order
  const sortedResults = productIds.map(id => 
    results.find(item => item.productId === id)
  ).filter(Boolean) as PriceStockItem[];
  
  return sortedResults;
}

export async function invalidatePriceStock(productId: string): Promise<void> {
  const redis = await getRedis();
  if (redis) {
    try {
      await redis.del(`price_stock:${productId}`);
      console.log(`[Price/Stock] Cache invalidated for product ${productId}`);
    } catch (error) {
      console.error(`[Price/Stock] Cache invalidation failed for ${productId}:`, error);
    }
  }
}

export async function warmPriceStockCache(productIds: string[]): Promise<void> {
  console.log(`[Price/Stock] Warming cache for ${productIds.length} products`);
  
  try {
    await getPriceStockData(productIds);
    console.log(`[Price/Stock] Cache warmed successfully`);
  } catch (error) {
    console.error('[Price/Stock] Cache warming failed:', error);
  }
}

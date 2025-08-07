import { Redis } from '@upstash/redis';

export async function testRedisConnection() {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  
  console.log('🔍 Redis Debug Info:');
  console.log('- Environment:', process.env.NODE_ENV);
  console.log('- Vercel Environment:', process.env.VERCEL_ENV);
  console.log('- Redis URL exists:', !!redisUrl);
  console.log('- Redis Token exists:', !!redisToken);
  console.log('- Redis URL length:', redisUrl?.length || 0);
  console.log('- Redis Token length:', redisToken?.length || 0);
  
  if (!redisUrl || !redisToken) {
    throw new Error('Redis environment variables not configured');
  }
  
  try {
    const redis = new Redis({
      url: redisUrl,
      token: redisToken,
    });
    
    // Test connection with ping
    const pingResult = await redis.ping();
    console.log('✅ Redis ping successful:', pingResult);
    
    // Test setting and getting a value
    const testKey = 'test_connection';
    const testValue = `test_${Date.now()}`;
    
    await redis.set(testKey, testValue, { ex: 60 }); // 60 seconds TTL
    const retrievedValue = await redis.get(testKey);
    
    console.log('✅ Redis set/get test successful');
    console.log('- Set value:', testValue);
    console.log('- Retrieved value:', retrievedValue);
    
    // Clean up test key
    await redis.del(testKey);
    
    return {
      success: true,
      ping: pingResult,
      setGetTest: retrievedValue === testValue,
      message: 'Redis connection and operations successful'
    };
    
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Redis connection failed'
    };
  }
}

export async function testWooCommerceCache() {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  
  if (!redisUrl || !redisToken) {
    throw new Error('Redis environment variables not configured');
  }
  
  try {
    const redis = new Redis({
      url: redisUrl,
      token: redisToken,
    });
    
    // Test WooCommerce cache key
    const cacheKey = 'wc_products:{"per_page":20}';
    const testData = {
      products: [
        { id: 1, name: 'Test Product', price: '99.99' }
      ],
      timestamp: new Date().toISOString()
    };
    
    // Set cache with 1 hour TTL
    await redis.set(cacheKey, JSON.stringify(testData), { ex: 3600 });
    
    // Retrieve cache
    const cachedData = await redis.get(cacheKey);
    let parsedData = null;
    
    if (cachedData) {
      try {
        parsedData = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        parsedData = cachedData; // Use raw data if parsing fails
      }
    }
    
    console.log('✅ WooCommerce cache test successful');
    console.log('- Cache key:', cacheKey);
    console.log('- Cached data:', parsedData);
    
    return {
      success: true,
      cacheKey,
      cachedData: parsedData,
      message: 'WooCommerce cache test successful'
    };
    
  } catch (error) {
    console.error('❌ WooCommerce cache test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'WooCommerce cache test failed'
    };
  }
} 
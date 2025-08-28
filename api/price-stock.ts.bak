import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Real-time Price & Stock API
 * Target: <200ms response time
 * Caches prices for 5 minutes, stock for 1 minute
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const startTime = Date.now();
  
  // CORS and performance headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300'); // 1min browser, 5min CDN
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { productIds } = req.query;
    
    if (!productIds || typeof productIds !== 'string') {
      return res.status(400).json({ error: 'productIds parameter required' });
    }
    
    const ids = productIds.split(',').map(id => id.trim()).filter(Boolean);
    
    if (ids.length === 0 || ids.length > 20) {
      return res.status(400).json({ error: 'Invalid productIds (1-20 products allowed)' });
    }

    // Dynamic import to avoid build issues
    const { getPriceStockData } = await import('../../src/lib/api/price-stock');
    
    const priceStockData = await getPriceStockData(ids);
    
    const responseTime = Date.now() - startTime;
    
    res.status(200).json({
      data: priceStockData,
      metadata: {
        responseTime,
        cached: priceStockData.some(item => item.cached),
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Price/Stock API Error:', error);
    
    const responseTime = Date.now() - startTime;
    
    res.status(500).json({ 
      error: 'Failed to fetch price/stock data',
      metadata: {
        responseTime,
        timestamp: new Date().toISOString()
      }
    });
  }
}

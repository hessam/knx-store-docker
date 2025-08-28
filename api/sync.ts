import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Import here to avoid module resolution issues during build
    const { getWooCommerceSync } = await import('../src/lib/api/woocommerce-sync');
    
    const sync = getWooCommerceSync();
    const action = typeof req.query.action === 'string' ? req.query.action : 'sync';

    switch (action) {
      case 'sync': {
        if (req.method !== 'GET') {
          return res.status(405).json({ error: 'Method not allowed for sync action' });
        }
        
        console.log("[WooCommerce Sync API] Manual sync requested");
        const products = await sync.fetchProducts();
        const status = await sync.getSyncStatus();

        return res.status(200).json({
          success: true,
          action: "sync",
          productsCount: products.length,
          lastSync: status.lastSync,
          status: status.status,
        });
      }

      case 'status': {
        if (req.method !== 'GET') {
          return res.status(405).json({ error: 'Method not allowed for status action' });
        }
        
        const status = await sync.getSyncStatus();
        return res.status(200).json({
          success: true,
          action: "status",
          ...status,
        });
      }

      case 'force-sync': {
        if (req.method !== 'POST') {
          return res.status(405).json({ error: 'Method not allowed for force-sync action. Use POST.' });
        }
        
        console.log("[WooCommerce Sync API] Force sync requested");
        await sync.clearCache();
        const products = await sync.fetchProducts({ forceRefresh: true });
        const status = await sync.getSyncStatus();

        return res.status(200).json({
          success: true,
          action: "force-sync",
          productsCount: products.length,
          lastSync: status.lastSync,
          status: status.status,
        });
      }

      default:
        return res.status(400).json({
          error: "Invalid action",
          availableActions: ["sync", "status", "force-sync"],
        });
    }
  } catch (error) {
    console.error('Sync API Error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error',
      action: req.query.action || 'unknown'
    });
  }
}

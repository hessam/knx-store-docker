import type { APIRoute } from 'astro';
import { getWooCommerceSync } from '../../lib/api/woocommerce-sync';

// Global sync interval (5 minutes) - unused but kept for future reference
// let syncInterval: NodeJS.Timeout | null = null;

// Initialize sync on module load
if (typeof window === 'undefined') {
  console.log('[WooCommerce Sync API] Initializing auto sync...');
  try {
    const sync = getWooCommerceSync();
    sync.startAutoSync();
  } catch (error) {
    console.error('[WooCommerce Sync API] Failed to initialize sync:', error);
  }
}

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action') || 'sync';
    
    const sync = getWooCommerceSync();
    
    switch (action) {
      case 'sync':
        // Manual sync
        console.log('[WooCommerce Sync API] Manual sync requested');
        const products = await sync.fetchProducts();
        const status = await sync.getSyncStatus();
        
        return new Response(JSON.stringify({
          success: true,
          action: 'sync',
          productsCount: products.length,
          status,
          timestamp: new Date().toISOString(),
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
        });

      case 'status':
        // Get sync status
        const syncStatus = await sync.getSyncStatus();
        
        return new Response(JSON.stringify({
          success: true,
          action: 'status',
          status: syncStatus,
          timestamp: new Date().toISOString(),
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
        });

      case 'health':
        // Health check
        const isHealthy = await sync.healthCheck();
        
        return new Response(JSON.stringify({
          success: isHealthy,
          action: 'health',
          healthy: isHealthy,
          timestamp: new Date().toISOString(),
        }), {
          status: isHealthy ? 200 : 503,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
        });

      case 'start':
        // Start auto sync
        sync.startAutoSync();
        
        return new Response(JSON.stringify({
          success: true,
          action: 'start',
          message: 'Auto sync started',
          timestamp: new Date().toISOString(),
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
        });

      case 'stop':
        // Stop auto sync
        sync.stopAutoSync();
        
        return new Response(JSON.stringify({
          success: true,
          action: 'stop',
          message: 'Auto sync stopped',
          timestamp: new Date().toISOString(),
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
        });

      default:
        return new Response(JSON.stringify({
          success: false,
          error: 'Invalid action',
          validActions: ['sync', 'status', 'health', 'start', 'stop'],
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        });
    }
  } catch (error: any) {
    console.error('[WooCommerce Sync API] Error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Internal server error',
      timestamp: new Date().toISOString(),
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { action, params } = body;
    
    const sync = getWooCommerceSync();
    
    switch (action) {
      case 'sync':
        // Sync with custom parameters
        const products = await sync.fetchProducts(params);
        const status = await sync.getSyncStatus();
        
        return new Response(JSON.stringify({
          success: true,
          action: 'sync',
          productsCount: products.length,
          status,
          timestamp: new Date().toISOString(),
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
        });

      default:
        return new Response(JSON.stringify({
          success: false,
          error: 'Invalid action',
          validActions: ['sync'],
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        });
    }
  } catch (error: any) {
    console.error('[WooCommerce Sync API] POST Error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Internal server error',
      timestamp: new Date().toISOString(),
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

// Cleanup on process exit
if (typeof process !== 'undefined') {
  process.on('SIGINT', async () => {
    console.log('[WooCommerce Sync API] Shutting down...');
    try {
      const sync = getWooCommerceSync();
      await sync.cleanup();
    } catch (error) {
      console.error('[WooCommerce Sync API] Cleanup error:', error);
    }
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('[WooCommerce Sync API] Shutting down...');
    try {
      const sync = getWooCommerceSync();
      await sync.cleanup();
    } catch (error) {
      console.error('[WooCommerce Sync API] Cleanup error:', error);
    }
    process.exit(0);
  });
} 
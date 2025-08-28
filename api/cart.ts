import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Optimized Cart Management API
 * Target: <200ms response time
 * Uses Redis for fast cart storage
 */

interface CartItem {
  productId: string;
  name: string;
  price: string;
  quantity: number;
  image?: string;
}

interface Cart {
  sessionId: string;
  items: CartItem[];
  total: string;
  itemCount: number;
  lastUpdated: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const startTime = Date.now();
  
  // CORS and performance headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { sessionId } = req.query;
    
    if (!sessionId || typeof sessionId !== 'string') {
      return res.status(400).json({ error: 'sessionId required' });
    }
    
    // Dynamic import with build compatibility
    try {
      const cartModule = await import('../src/lib/api/build-compatible.js');
      const { getCartManager } = cartModule;
      const cartManager = await getCartManager();
    
      switch (req.method) {
        case 'GET':
          // Get cart contents
          const cart = await cartManager.getCart(sessionId);
          
          res.status(200).json({
            cart,
            metadata: {
              responseTime: Date.now() - startTime,
              timestamp: new Date().toISOString()
            }
          });
          break;
          
        case 'POST':
          // Add item to cart
          const { item } = req.body;
          
          if (!item || !item.productId || !item.quantity) {
            return res.status(400).json({ error: 'Invalid item data' });
          }
          
          const updatedCart = await cartManager.addItem(sessionId, item);
          
          res.status(200).json({
            cart: updatedCart,
            metadata: {
              responseTime: Date.now() - startTime,
              timestamp: new Date().toISOString()
            }
          });
          break;
          
        case 'PUT':
          // Update item quantity
          const { productId, quantity } = req.body;
          
          if (!productId || quantity === undefined) {
            return res.status(400).json({ error: 'productId and quantity required' });
          }
          
          const modifiedCart = await cartManager.updateItem(sessionId, productId, quantity);
          
          res.status(200).json({
            cart: modifiedCart,
            metadata: {
              responseTime: Date.now() - startTime,
              timestamp: new Date().toISOString()
            }
          });
          break;
          
        case 'DELETE':
          // Remove item or clear cart
          const { productId: removeProductId } = req.body;
          
          let clearedCart;
          if (removeProductId) {
            clearedCart = await cartManager.removeItem(sessionId, removeProductId);
          } else {
            await cartManager.clearCart(sessionId);
            clearedCart = await cartManager.getCart(sessionId);
          }
          
          res.status(200).json({
            cart: clearedCart,
            metadata: {
              responseTime: Date.now() - startTime,
              timestamp: new Date().toISOString()
            }
          });
          break;
          
        default:
          res.status(405).json({ error: 'Method not allowed' });
      }
    } catch (importError) {
      console.error('Failed to import cart module:', importError);
      res.status(500).json({ 
        error: 'Cart service unavailable',
        metadata: {
          responseTime: Date.now() - startTime,
          timestamp: new Date().toISOString()
        }
      });
    }
    
  } catch (error) {
    console.error('Cart API Error:', error);
    
    const responseTime = Date.now() - startTime;
    
    res.status(500).json({ 
      error: 'Cart operation failed',
      metadata: {
        responseTime,
        timestamp: new Date().toISOString()
      }
    });
  }
}

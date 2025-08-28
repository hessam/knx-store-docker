/**
 * Advanced Cart Management System
 * Target: Sub-200ms cart operations
 * Features: Redis-based storage, session persistence, smart caching
 */

interface CartItem {
  productId: string;
  name: string;
  price: string;
  quantity: number;
  image?: string;
  variant?: {
    size?: string;
    color?: string;
    attributes?: Record<string, string>;
  };
}

interface Cart {
  sessionId: string;
  items: CartItem[];
  total: string;
  itemCount: number;
  lastUpdated: string;
  currency: string;
  metadata?: {
    discountCodes?: string[];
    shippingMethod?: string;
    notes?: string;
  };
}

interface CartManager {
  getCart: (sessionId: string) => Promise<Cart>;
  addItem: (sessionId: string, item: Omit<CartItem, 'quantity'>, quantity?: number) => Promise<Cart>;
  updateItem: (sessionId: string, productId: string, quantity: number) => Promise<Cart>;
  removeItem: (sessionId: string, productId: string) => Promise<Cart>;
  clearCart: (sessionId: string) => Promise<boolean>;
  calculateTotal: (items: CartItem[]) => string;
}

interface RedisInstance {
  get: (key: string) => Promise<string | null>;
  setex: (key: string, ttl: number, value: string) => Promise<string>;
  del: (key: string) => Promise<number>;
  exists: (key: string) => Promise<number>;
}

let redisInstance: RedisInstance | null = null;
let cartManagerInstance: CartManager | null = null;

async function getRedis(): Promise<RedisInstance | null> {
  if (redisInstance) return redisInstance;
  
  try {
    const { Redis } = await import('@upstash/redis');
    
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      console.warn('[Cart Manager] Redis not configured, using in-memory storage');
      return null;
    }
    
    redisInstance = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    
    return redisInstance;
  } catch (error) {
    console.error('[Cart Manager] Redis connection failed:', error);
    return null;
  }
}

// In-memory fallback for when Redis is not available
const memoryStorage = new Map<string, Cart>();

class OptimizedCartManager implements CartManager {
  private redis: RedisInstance | null = null;
  private readonly CART_TTL = 24 * 60 * 60; // 24 hours
  private readonly CART_KEY_PREFIX = 'cart:';

  constructor(redis: RedisInstance | null) {
    this.redis = redis;
  }

  private getCartKey(sessionId: string): string {
    return `${this.CART_KEY_PREFIX}${sessionId}`;
  }

  private async getStoredCart(sessionId: string): Promise<Cart | null> {
    try {
      if (this.redis) {
        const cartData = await this.redis.get(this.getCartKey(sessionId));
        return cartData ? JSON.parse(cartData) : null;
      } else {
        // Fallback to memory storage
        return memoryStorage.get(sessionId) || null;
      }
    } catch (error) {
      console.error('[Cart Manager] Failed to get cart:', error);
      return null;
    }
  }

  private async storeCart(cart: Cart): Promise<void> {
    try {
      if (this.redis) {
        await this.redis.setex(
          this.getCartKey(cart.sessionId),
          this.CART_TTL,
          JSON.stringify(cart)
        );
      } else {
        // Fallback to memory storage
        memoryStorage.set(cart.sessionId, cart);
      }
    } catch (error) {
      console.error('[Cart Manager] Failed to store cart:', error);
      throw new Error('Failed to save cart');
    }
  }

  calculateTotal(items: CartItem[]): string {
    const total = items.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      return sum + (price * item.quantity);
    }, 0);
    
    return total.toFixed(2);
  }

  async getCart(sessionId: string): Promise<Cart> {
    const existingCart = await this.getStoredCart(sessionId);
    
    if (existingCart) {
      return existingCart;
    }

    // Create new empty cart
    const newCart: Cart = {
      sessionId,
      items: [],
      total: '0.00',
      itemCount: 0,
      lastUpdated: new Date().toISOString(),
      currency: 'USD'
    };

    await this.storeCart(newCart);
    return newCart;
  }

  async addItem(sessionId: string, item: Omit<CartItem, 'quantity'>, quantity: number = 1): Promise<Cart> {
    const cart = await this.getCart(sessionId);
    
    // Check if item already exists
    const existingItemIndex = cart.items.findIndex(
      cartItem => cartItem.productId === item.productId
    );

    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        ...item,
        quantity
      });
    }

    // Recalculate totals
    cart.total = this.calculateTotal(cart.items);
    cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.lastUpdated = new Date().toISOString();

    await this.storeCart(cart);
    return cart;
  }

  async updateItem(sessionId: string, productId: string, quantity: number): Promise<Cart> {
    const cart = await this.getCart(sessionId);
    
    const itemIndex = cart.items.findIndex(item => item.productId === productId);
    
    if (itemIndex === -1) {
      throw new Error('Item not found in cart');
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }

    // Recalculate totals
    cart.total = this.calculateTotal(cart.items);
    cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.lastUpdated = new Date().toISOString();

    await this.storeCart(cart);
    return cart;
  }

  async removeItem(sessionId: string, productId: string): Promise<Cart> {
    const cart = await this.getCart(sessionId);
    
    cart.items = cart.items.filter(item => item.productId !== productId);
    
    // Recalculate totals
    cart.total = this.calculateTotal(cart.items);
    cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.lastUpdated = new Date().toISOString();

    await this.storeCart(cart);
    return cart;
  }

  async clearCart(sessionId: string): Promise<boolean> {
    try {
      if (this.redis) {
        const deleted = await this.redis.del(this.getCartKey(sessionId));
        return deleted > 0;
      } else {
        return memoryStorage.delete(sessionId);
      }
    } catch (error) {
      console.error('[Cart Manager] Failed to clear cart:', error);
      return false;
    }
  }
}

export async function getCartManager(): Promise<CartManager> {
  if (cartManagerInstance) {
    return cartManagerInstance;
  }

  const redis = await getRedis();
  cartManagerInstance = new OptimizedCartManager(redis);
  
  return cartManagerInstance;
}

// Export types for use in API endpoints
export type { Cart, CartItem, CartManager };

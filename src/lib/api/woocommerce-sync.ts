import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import { Redis } from '@upstash/redis';

// WooCommerce Product Interface
export interface WooCommerceProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  date_created: string;
  date_modified: string;
  type: string;
  status: string;
  featured: boolean;
  catalog_visibility: string;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  date_on_sale_from: string | null;
  date_on_sale_to: string | null;
  on_sale: boolean;
  purchasable: boolean;
  total_sales: number;
  virtual: boolean;
  downloadable: boolean;
  downloads: Array<{
    name: string;
    file: string;
  }>;
  download_limit: number;
  download_expiry: number;
  tax_status: string;
  tax_class: string;
  manage_stock: boolean;
  stock_quantity: number | null;
  stock_status: string;
  backorders: string;
  backorders_allowed: boolean;
  backordered: boolean;
  sold_individually: boolean;
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  shipping_required: boolean;
  shipping_taxable: boolean;
  shipping_class: string;
  shipping_class_id: number;
  reviews_allowed: boolean;
  average_rating: string;
  rating_count: number;
  images: Array<{
    id: number;
    date_created: string;
    date_modified: string;
    src: string;
    name: string;
    alt: string;
  }>;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  tags: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  attributes: Array<{
    id: number;
    name: string;
    position: number;
    visible: boolean;
    variation: boolean;
    options: string[];
  }>;
  variations: number[];
  menu_order: number;
  meta_data: Array<{
    id: number;
    key: string;
    value: any;
  }>;
  _links: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
  };
}

// WooCommerce API Configuration
export interface WooCommerceConfig {
  baseURL: string;
  consumerKey: string;
  consumerSecret: string;
  timeout?: number;
  redis?: {
    host: string;
    port: number;
    password?: string;
  };
}

// Sync Status Interface
export interface SyncStatus {
  lastSync: string;
  totalProducts: number;
  status: 'success' | 'error' | 'fallback';
  error?: string;
  retryCount: number;
}

export class WooCommerceSync {
  private client: AxiosInstance;
  private redis: Redis | null = null;
  private _config: WooCommerceConfig;
  private syncInterval: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;

  constructor(config: WooCommerceConfig) {
    this._config = config;
    
    // Initialize Axios client with WooCommerce authentication
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 10000,
      auth: {
        username: config.consumerKey,
        password: config.consumerSecret,
      },
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'KNX-Store-Sync/1.0',
      },
    });

    // Initialize Redis connection (Upstash or local)
    this.initializeRedis();

    // Add request/response interceptors for logging
    this.setupInterceptors();
  }

  private initializeRedis(): void {
    // Try Upstash Redis first (for Vercel)
    const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
    const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
    
    if (upstashUrl && upstashToken) {
      try {
        this.redis = new Redis({
          url: upstashUrl,
          token: upstashToken,
        });
        console.log('[WooCommerce Sync] Upstash Redis connected successfully');
        return;
      } catch (error) {
        console.error('[WooCommerce Sync] Failed to initialize Upstash Redis:', error);
      }
    }

    // Fallback to local Redis (for development)
    if (this._config.redis) {
      try {
        // For local development, we'll use a different approach
        // since Upstash Redis doesn't support the same interface as ioredis
        console.log('[WooCommerce Sync] Local Redis not available in production, using fallback');
        this.redis = null;
      } catch (error) {
        console.error('[WooCommerce Sync] Failed to initialize local Redis:', error);
        this.redis = null;
      }
    }
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(`[WooCommerce Sync] Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[WooCommerce Sync] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log(`[WooCommerce Sync] Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('[WooCommerce Sync] Response error:', error.response?.status, error.message);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Fetch products from WooCommerce API with retry logic and fallback
   */
  async fetchProducts(params?: {
    page?: number;
    per_page?: number;
    status?: string;
    featured?: boolean;
    category?: string;
    tag?: string;
    search?: string;
  }): Promise<WooCommerceProduct[]> {
    const cacheKey = `wc_products:${JSON.stringify(params || {})}`;
    
    // Try to get from cache first
    const cached = await this.getCached<WooCommerceProduct[]>(cacheKey);
    if (cached) {
      console.log(`[WooCommerce Sync] Cache hit for products`);
      return cached;
    }

    let attempts = 0;
    const maxAttempts = 3;
    const baseDelay = 1000; // 1 second

    while (attempts < maxAttempts) {
      try {
        console.log(`[WooCommerce Sync] Attempting to fetch products (attempt ${attempts + 1}/${maxAttempts})`);
        console.log(`[WooCommerce Sync] API URL: ${this.client.defaults.baseURL}/products`);
        
        const response: AxiosResponse<WooCommerceProduct[]> = await this.client.get('/products', {
          params: {
            per_page: 100, // Maximum per page
            ...params,
          },
        });

        const products = response.data;
        console.log(`[WooCommerce Sync] API response status: ${response.status}`);
        console.log(`[WooCommerce Sync] Products received: ${products.length}`);
        console.log(`[WooCommerce Sync] First product:`, products[0]?.name);
        
        // Cache the result for 5 minutes
        await this.setCached(cacheKey, products, 300);
        
        // Update sync status
        await this.updateSyncStatus({
          lastSync: new Date().toISOString(),
          totalProducts: products.length,
          status: 'success',
          retryCount: attempts,
        });

        console.log(`[WooCommerce Sync] Successfully fetched ${products.length} products`);
        return products;

      } catch (error: any) {
        attempts++;
        console.error(`[WooCommerce Sync] Attempt ${attempts}/${maxAttempts} failed:`, error.message);
        console.error(`[WooCommerce Sync] Error details:`, {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          method: error.config?.method,
        });

        if (attempts === maxAttempts) {
          console.error('[WooCommerce Sync] Max retries reached, using fallback data');
          
          // Update sync status with error
          await this.updateSyncStatus({
            lastSync: new Date().toISOString(),
            totalProducts: 0,
            status: 'error',
            error: error.message,
            retryCount: attempts,
          });

          // Return fallback data
          return this.getFallbackProducts();
        }

        // Exponential backoff
        const delay = baseDelay * Math.pow(2, attempts - 1);
        console.log(`[WooCommerce Sync] Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    // This should never be reached, but TypeScript requires it
    return this.getFallbackProducts();
  }

  /**
   * Get a single product by ID
   */
  async getProduct(productId: number): Promise<WooCommerceProduct> {
    const cacheKey = `wc_product:${productId}`;
    
    // Try to get from cache first
    const cached = await this.getCached<WooCommerceProduct>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response: AxiosResponse<WooCommerceProduct> = await this.client.get(`/products/${productId}`);
      const product = response.data;
      
      // Cache the result for 5 minutes
      await this.setCached(cacheKey, product, 300);
      
      return product;
    } catch (error: any) {
      console.error(`[WooCommerce Sync] Error fetching product ${productId}:`, error.message);
      throw new Error(`Failed to fetch product ${productId}: ${error.message}`);
    }
  }

  /**
   * Start automatic sync every 5 minutes
   */
  startAutoSync(): void {
    if (this.syncInterval) {
      console.log('[WooCommerce Sync] Auto sync already running');
      return;
    }

    console.log('[WooCommerce Sync] Starting auto sync every 5 minutes');
    
    // Initial sync
    this.performSync();
    
    // Set up interval
    this.syncInterval = setInterval(() => {
      this.performSync();
    }, 5 * 60 * 1000); // 5 minutes
  }

  /**
   * Stop automatic sync
   */
  stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('[WooCommerce Sync] Auto sync stopped');
    }
  }

  /**
   * Perform a single sync operation
   */
  private async performSync(): Promise<void> {
    if (this.isRunning) {
      console.log('[WooCommerce Sync] Sync already in progress, skipping');
      return;
    }

    this.isRunning = true;
    console.log('[WooCommerce Sync] Starting sync...');

    try {
      await this.fetchProducts();
      console.log('[WooCommerce Sync] Sync completed successfully');
    } catch (error) {
      console.error('[WooCommerce Sync] Sync failed:', error);
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Get sync status
   */
  async getSyncStatus(): Promise<SyncStatus | null> {
    if (!this.redis) return null;

    try {
      const status = await this.redis.get('wc_sync_status');
      return status ? JSON.parse(status as string) : null;
    } catch (error) {
      console.error('[WooCommerce Sync] Error getting sync status:', error);
      return null;
    }
  }

  /**
   * Update sync status
   */
  private async updateSyncStatus(status: SyncStatus): Promise<void> {
    if (!this.redis) return;

    try {
      await this.redis.setex('wc_sync_status', 3600, JSON.stringify(status)); // 1 hour TTL
    } catch (error) {
      console.error('[WooCommerce Sync] Error updating sync status:', error);
    }
  }

  /**
   * Cache operations
   */
  private async getCached<T>(key: string): Promise<T | null> {
    if (!this.redis) return null;
    
    try {
      const cached = await this.redis.get(key);
      return cached ? JSON.parse(cached as string) : null;
    } catch (error) {
      console.error(`[WooCommerce Sync] Cache get error for key ${key}:`, error);
      return null;
    }
  }

  private async setCached(key: string, data: any, ttl: number = 300): Promise<void> {
    if (!this.redis) return;
    
    try {
      await this.redis.setex(key, ttl, JSON.stringify(data));
    } catch (error) {
      console.error(`[WooCommerce Sync] Cache set error for key ${key}:`, error);
    }
  }

  /**
   * Fallback products when API fails
   */
  private getFallbackProducts(): WooCommerceProduct[] {
    console.log('[WooCommerce Sync] Using fallback products');
    
    return [
      {
        id: 1,
        name: 'KNX Smart Switch - Fallback',
        slug: 'knx-smart-switch-fallback',
        permalink: 'https://mohtavaly.com/product/knx-smart-switch-fallback/',
        date_created: new Date().toISOString(),
        date_modified: new Date().toISOString(),
        type: 'simple',
        status: 'publish',
        featured: false,
        catalog_visibility: 'visible',
        description: 'Fallback product - WooCommerce API temporarily unavailable',
        short_description: 'Fallback product',
        sku: 'FALLBACK-001',
        price: '99.99',
        regular_price: '99.99',
        sale_price: '',
        date_on_sale_from: null,
        date_on_sale_to: null,
        on_sale: false,
        purchasable: true,
        total_sales: 0,
        virtual: false,
        downloadable: false,
        downloads: [],
        download_limit: -1,
        download_expiry: -1,
        tax_status: 'taxable',
        tax_class: '',
        manage_stock: false,
        stock_quantity: null,
        stock_status: 'instock',
        backorders: 'no',
        backorders_allowed: false,
        backordered: false,
        sold_individually: false,
        weight: '0.5',
        dimensions: {
          length: '10',
          width: '5',
          height: '2',
        },
        shipping_required: true,
        shipping_taxable: true,
        shipping_class: '',
        shipping_class_id: 0,
        reviews_allowed: true,
        average_rating: '0.00',
        rating_count: 0,
        images: [
          {
            id: 1,
            date_created: new Date().toISOString(),
            date_modified: new Date().toISOString(),
            src: 'https://picsum.photos/300/300?random=1',
            name: 'Fallback Product',
            alt: 'Fallback Product Image',
          },
        ],
        categories: [
          {
            id: 1,
            name: 'KNX Products',
            slug: 'knx-products',
          },
        ],
        tags: [],
        attributes: [],
        variations: [],
        menu_order: 0,
        meta_data: [],
        _links: {
          self: [{ href: 'https://mohtavaly.com/wp-json/wc/v3/products/1' }],
          collection: [{ href: 'https://mohtavaly.com/wp-json/wc/v3/products' }],
        },
      },
    ];
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/products', { params: { per_page: 1 } });
      return response.status === 200;
    } catch (error) {
      console.error('[WooCommerce Sync] Health check failed:', error);
      return false;
    }
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    this.stopAutoSync();
    if (this.redis) {
      await this.redis.quit();
    }
  }
}

// Default WooCommerce sync instance
let wooCommerceSyncInstance: WooCommerceSync | null = null;

export const createWooCommerceSync = (config: WooCommerceConfig): WooCommerceSync => {
  return new WooCommerceSync(config);
};

export const getWooCommerceSync = (): WooCommerceSync => {
  if (!wooCommerceSyncInstance) {
    const baseURL = process.env.WOOCOMMERCE_API_URL || 'https://mohtavaly.com/wp-json/wc/v3';
    const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY || '';
    const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET || '';

    console.log('[WooCommerce Sync] Environment check:', {
      baseURL,
      consumerKey: consumerKey ? 'SET' : 'NOT SET',
      consumerSecret: consumerSecret ? 'SET' : 'NOT SET',
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
    });

    if (!consumerKey || !consumerSecret) {
      console.error('[WooCommerce Sync] Missing credentials:', {
        consumerKey: !!consumerKey,
        consumerSecret: !!consumerSecret,
      });
      throw new Error('WooCommerce API credentials not configured. Please set WOOCOMMERCE_CONSUMER_KEY and WOOCOMMERCE_CONSUMER_SECRET environment variables.');
    }

    console.log('[WooCommerce Sync] Creating instance with URL:', baseURL);

    wooCommerceSyncInstance = createWooCommerceSync({
      baseURL,
      consumerKey,
      consumerSecret,
      timeout: 10000,
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
      },
    });
  }
  return wooCommerceSyncInstance;
}; 
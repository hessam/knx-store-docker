import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';

// Types for WooCommerce API responses
export interface WooCommerceProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
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
  date_on_sale_from_gmt: string | null;
  date_on_sale_to: string | null;
  date_on_sale_to_gmt: string | null;
  price_html: string;
  on_sale: boolean;
  purchasable: boolean;
  total_sales: number;
  virtual: boolean;
  downloadable: boolean;
  downloads: any[];
  download_limit: number;
  download_expiry: number;
  external_url: string;
  button_text: string;
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
  related_ids: number[];
  upsell_ids: number[];
  cross_sell_ids: number[];
  parent_id: number;
  purchase_note: string;
  categories: WooCommerceCategory[];
  tags: WooCommerceTag[];
  images: WooCommerceImage[];
  attributes: WooCommerceAttribute[];
  default_attributes: WooCommerceAttribute[];
  variations: number[];
  grouped_products: number[];
  menu_order: number;
  meta_data: WooCommerceMetaData[];
  _links: any;
}

export interface WooCommerceCategory {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description: string;
  display: string;
  image: WooCommerceImage | null;
  menu_order: number;
  count: number;
  _links: any;
}

export interface WooCommerceTag {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
  _links: any;
}

export interface WooCommerceImage {
  id: number;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  src: string;
  name: string;
  alt: string;
}

export interface WooCommerceAttribute {
  id: number;
  name: string;
  position: number;
  visible: boolean;
  variation: boolean;
  options: string[];
}

export interface WooCommerceMetaData {
  id: number;
  key: string;
  value: any;
}

export interface WooCommerceOrder {
  id: number;
  parent_id: number;
  number: string;
  order_key: string;
  created_via: string;
  version: string;
  status: string;
  currency: string;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  discount_total: string;
  discount_tax: string;
  shipping_total: string;
  shipping_tax: string;
  cart_tax: string;
  total: string;
  total_tax: string;
  prices_include_tax: boolean;
  customer_id: number;
  customer_ip_address: string;
  customer_user_agent: string;
  customer_note: string;
  billing: WooCommerceAddress;
  shipping: WooCommerceAddress;
  payment_method: string;
  payment_method_title: string;
  transaction_id: string;
  date_paid: string | null;
  date_paid_gmt: string | null;
  date_completed: string | null;
  date_completed_gmt: string | null;
  cart_hash: string;
  meta_data: WooCommerceMetaData[];
  line_items: WooCommerceLineItem[];
  tax_lines: any[];
  shipping_lines: any[];
  fee_lines: any[];
  coupon_lines: any[];
  refunds: any[];
  _links: any;
}

export interface WooCommerceAddress {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email: string;
  phone: string;
}

export interface WooCommerceLineItem {
  id: number;
  name: string;
  product_id: number;
  variation_id: number;
  quantity: number;
  tax_class: string;
  subtotal: string;
  subtotal_tax: string;
  total: string;
  total_tax: string;
  taxes: any[];
  meta_data: WooCommerceMetaData[];
  sku: string;
  price: number;
}

// API Configuration
export interface WooCommerceConfig {
  baseURL: string;
  consumerKey: string;
  consumerSecret: string;
  timeout?: number;
  version?: string;
}

// WooCommerce API Client Class
export class WooCommerceAPI {
  private client: AxiosInstance;
  private config: WooCommerceConfig;

  constructor(config: WooCommerceConfig) {
    this.config = config;
    
    // Create basic auth header
    const auth = Buffer.from(`${config.consumerKey}:${config.consumerSecret}`).toString('base64');
    
    this.client = axios.create({
      baseURL: `${config.baseURL}/wp-json/wc/v${config.version || '3'}`,
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
      },
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`[WooCommerce API] Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[WooCommerce API] Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        console.log(`[WooCommerce API] Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('[WooCommerce API] Response Error:', error.response?.status, error.response?.data);
        return Promise.reject(error);
      }
    );
  }

  // Products API
  async getProducts(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    category?: number;
    tag?: number;
    status?: string;
    featured?: boolean;
    on_sale?: boolean;
    orderby?: string;
    order?: 'asc' | 'desc';
  }): Promise<WooCommerceProduct[]> {
    try {
      const response: AxiosResponse<WooCommerceProduct[]> = await this.client.get('/products', {
        params: {
          ...params,
        },
      });
      return response.data;
    } catch (error) {
      console.error('[WooCommerce API] Error fetching products:', error);
      throw new Error('Failed to fetch products from WooCommerce');
    }
  }

  async getProduct(productId: number): Promise<WooCommerceProduct> {
    try {
      const response: AxiosResponse<WooCommerceProduct> = await this.client.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`[WooCommerce API] Error fetching product ${productId}:`, error);
      throw new Error(`Failed to fetch product ${productId} from WooCommerce`);
    }
  }

  async getProductBySlug(slug: string): Promise<WooCommerceProduct> {
    try {
      const response: AxiosResponse<WooCommerceProduct[]> = await this.client.get('/products', {
        params: {
          slug,
        },
      });
      
      if (response.data && response.data.length > 0) {
        return response.data[0];
      }
      
      throw new Error(`Product with slug "${slug}" not found`);
    } catch (error) {
      console.error(`[WooCommerce API] Error fetching product "${slug}":`, error);
      throw new Error(`Failed to fetch product "${slug}" from WooCommerce`);
    }
  }

  // Categories API
  async getCategories(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    parent?: number;
    orderby?: string;
    order?: 'asc' | 'desc';
  }): Promise<WooCommerceCategory[]> {
    try {
      const response: AxiosResponse<WooCommerceCategory[]> = await this.client.get('/products/categories', {
        params: {
          ...params,
        },
      });
      return response.data;
    } catch (error) {
      console.error('[WooCommerce API] Error fetching categories:', error);
      throw new Error('Failed to fetch categories from WooCommerce');
    }
  }

  async getCategory(categoryId: number): Promise<WooCommerceCategory> {
    try {
      const response: AxiosResponse<WooCommerceCategory> = await this.client.get(`/products/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error(`[WooCommerce API] Error fetching category ${categoryId}:`, error);
      throw new Error(`Failed to fetch category ${categoryId} from WooCommerce`);
    }
  }

  // Tags API
  async getTags(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    orderby?: string;
    order?: 'asc' | 'desc';
  }): Promise<WooCommerceTag[]> {
    try {
      const response: AxiosResponse<WooCommerceTag[]> = await this.client.get('/products/tags', {
        params: {
          ...params,
        },
      });
      return response.data;
    } catch (error) {
      console.error('[WooCommerce API] Error fetching tags:', error);
      throw new Error('Failed to fetch tags from WooCommerce');
    }
  }

  // Orders API
  async getOrders(params?: {
    page?: number;
    per_page?: number;
    status?: string;
    customer?: number;
    product?: number;
    orderby?: string;
    order?: 'asc' | 'desc';
  }): Promise<WooCommerceOrder[]> {
    try {
      const response: AxiosResponse<WooCommerceOrder[]> = await this.client.get('/orders', {
        params: {
          ...params,
        },
      });
      return response.data;
    } catch (error) {
      console.error('[WooCommerce API] Error fetching orders:', error);
      throw new Error('Failed to fetch orders from WooCommerce');
    }
  }

  async getOrder(orderId: number): Promise<WooCommerceOrder> {
    try {
      const response: AxiosResponse<WooCommerceOrder> = await this.client.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error(`[WooCommerce API] Error fetching order ${orderId}:`, error);
      throw new Error(`Failed to fetch order ${orderId} from WooCommerce`);
    }
  }

  async createOrder(orderData: Partial<WooCommerceOrder>): Promise<WooCommerceOrder> {
    try {
      const response: AxiosResponse<WooCommerceOrder> = await this.client.post('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('[WooCommerce API] Error creating order:', error);
      throw new Error('Failed to create order in WooCommerce');
    }
  }

  async updateOrder(orderId: number, orderData: Partial<WooCommerceOrder>): Promise<WooCommerceOrder> {
    try {
      const response: AxiosResponse<WooCommerceOrder> = await this.client.put(`/orders/${orderId}`, orderData);
      return response.data;
    } catch (error) {
      console.error(`[WooCommerce API] Error updating order ${orderId}:`, error);
      throw new Error(`Failed to update order ${orderId} in WooCommerce`);
    }
  }

  // Search API
  async searchProducts(query: string, params?: {
    page?: number;
    per_page?: number;
    category?: number;
    tag?: number;
  }): Promise<WooCommerceProduct[]> {
    try {
      const response: AxiosResponse<WooCommerceProduct[]> = await this.client.get('/products', {
        params: {
          search: query,
          ...params,
        },
      });
      return response.data;
    } catch (error) {
      console.error('[WooCommerce API] Error searching products:', error);
      throw new Error('Failed to search products in WooCommerce');
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/products');
      return response.status === 200;
    } catch (error) {
      console.error('[WooCommerce API] Health check failed:', error);
      return false;
    }
  }
}

// Default WooCommerce API instance
export const createWooCommerceAPI = (config: WooCommerceConfig): WooCommerceAPI => {
  return new WooCommerceAPI(config);
};

// Singleton instance (will be initialized with environment variables)
let wooCommerceAPIInstance: WooCommerceAPI | null = null;

export const getWooCommerceAPI = (): WooCommerceAPI => {
  if (!wooCommerceAPIInstance) {
    const baseURL = process.env.WORDPRESS_API_URL || 'https://placeholder.com';
    const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY || 'placeholder_key';
    const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET || 'placeholder_secret';
    
    wooCommerceAPIInstance = createWooCommerceAPI({
      baseURL,
      consumerKey,
      consumerSecret,
      timeout: 10000,
      version: '3',
    });
  }
  return wooCommerceAPIInstance;
}; 
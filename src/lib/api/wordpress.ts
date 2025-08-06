import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import Redis from 'ioredis';

// Types for WordPress API responses
export interface WordPressPost {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: any[];
  _links: any;
}

export interface WordPressPage {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  parent: number;
  menu_order: number;
  comment_status: string;
  ping_status: string;
  template: string;
  meta: any[];
  _links: any;
}

export interface WordPressMedia {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  author: number;
  comment_status: string;
  ping_status: string;
  template: string;
  meta: any[];
  description: {
    rendered: string;
  };
  caption: {
    rendered: string;
  };
  alt_text: string;
  media_type: string;
  mime_type: string;
  media_details: {
    width: number;
    height: number;
    file: string;
    sizes: {
      [key: string]: {
        file: string;
        width: number;
        height: number;
        mime_type: string;
        source_url: string;
      };
    };
  };
  source_url: string;
  _links: any;
}

// API Configuration
export interface WordPressConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  redis?: {
    host: string;
    port: number;
    password?: string;
  };
}

// WordPress API Client Class
export class WordPressAPI {
  private client: AxiosInstance;
  // private _config: WordPressConfig; // Unused in this implementation
  private redis: Redis | null = null;

  constructor(config: WordPressConfig) {
    // this._config = config; // Unused in this implementation
    
    // Initialize Redis if configured
    if (config.redis) {
      this.redis = new Redis({
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.password,
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 3,
      } as any);
    }
    
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`[WordPress API] Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[WordPress API] Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        console.log(`[WordPress API] Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('[WordPress API] Response Error:', error.response?.status, error.response?.data);
        return Promise.reject(error);
      }
    );
  }

  // Posts API
  async getPosts(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    categories?: number[];
    tags?: number[];
    author?: number;
    orderby?: string;
    order?: 'asc' | 'desc';
  }): Promise<WordPressPost[]> {
    try {
      const response: AxiosResponse<WordPressPost[]> = await this.client.get('/wp/v2/posts', {
        params: {
          _embed: true,
          ...params,
        },
      });
      return response.data;
    } catch (error) {
      console.error('[WordPress API] Error fetching posts:', error);
      throw new Error('Failed to fetch posts from WordPress');
    }
  }

  async getPost(slug: string): Promise<WordPressPost> {
    try {
      const response: AxiosResponse<WordPressPost> = await this.client.get(`/wp/v2/posts`, {
        params: {
          slug,
          _embed: true,
        },
      });
      
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        return response.data[0];
      }
      
      throw new Error(`Post with slug "${slug}" not found`);
    } catch (error) {
      console.error(`[WordPress API] Error fetching post "${slug}":`, error);
      throw new Error(`Failed to fetch post "${slug}" from WordPress`);
    }
  }

  // Pages API
  async getPages(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    parent?: number;
    orderby?: string;
    order?: 'asc' | 'desc';
  }): Promise<WordPressPage[]> {
    try {
      const response: AxiosResponse<WordPressPage[]> = await this.client.get('/wp/v2/pages', {
        params: {
          _embed: true,
          ...params,
        },
      });
      return response.data;
    } catch (error) {
      console.error('[WordPress API] Error fetching pages:', error);
      throw new Error('Failed to fetch pages from WordPress');
    }
  }

  async getPage(slug: string): Promise<WordPressPage> {
    try {
      const response: AxiosResponse<WordPressPage> = await this.client.get(`/wp/v2/pages`, {
        params: {
          slug,
          _embed: true,
        },
      });
      
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        return response.data[0];
      }
      
      throw new Error(`Page with slug "${slug}" not found`);
    } catch (error) {
      console.error(`[WordPress API] Error fetching page "${slug}":`, error);
      throw new Error(`Failed to fetch page "${slug}" from WordPress`);
    }
  }

  // Media API
  async getMedia(mediaId: number): Promise<WordPressMedia> {
    try {
      const response: AxiosResponse<WordPressMedia> = await this.client.get(`/wp/v2/media/${mediaId}`);
      return response.data;
    } catch (error) {
      console.error(`[WordPress API] Error fetching media ${mediaId}:`, error);
      throw new Error(`Failed to fetch media ${mediaId} from WordPress`);
    }
  }

  // Categories API
  async getCategories(): Promise<any[]> {
    try {
      const response: AxiosResponse<any[]> = await this.client.get('/wp/v2/categories');
      return response.data;
    } catch (error) {
      console.error('[WordPress API] Error fetching categories:', error);
      throw new Error('Failed to fetch categories from WordPress');
    }
  }

  // Tags API
  async getTags(): Promise<any[]> {
    try {
      const response: AxiosResponse<any[]> = await this.client.get('/wp/v2/tags');
      return response.data;
    } catch (error) {
      console.error('[WordPress API] Error fetching tags:', error);
      throw new Error('Failed to fetch tags from WordPress');
    }
  }

  // Search API
  async search(query: string, type: 'post' | 'page' = 'post'): Promise<any[]> {
    try {
      const response: AxiosResponse<any[]> = await this.client.get(`/wp/v2/${type}s`, {
        params: {
          search: query,
          _embed: true,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`[WordPress API] Error searching ${type}s:`, error);
      throw new Error(`Failed to search ${type}s in WordPress`);
    }
  }

  // Caching methods
  private async getCached<T>(key: string): Promise<T | null> {
    if (!this.redis) return null;
    
    try {
      const cached = await this.redis.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error(`[WordPress API] Cache get error for key ${key}:`, error);
      return null;
    }
  }

  private async setCached(key: string, data: any, ttl: number = 300): Promise<void> {
    if (!this.redis) return;
    
    try {
      await this.redis.set(key, JSON.stringify(data), 'EX', ttl);
    } catch (error) {
      console.error(`[WordPress API] Cache set error for key ${key}:`, error);
    }
  }

  // Enhanced fetchProducts with caching and comprehensive error handling
  async fetchProducts(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    categories?: number[];
    tags?: number[];
    author?: number;
    orderby?: string;
    order?: 'asc' | 'desc';
  }): Promise<WordPressPost[]> {
    const cacheKey = `products:${JSON.stringify(params || {})}`;
    
    // Try to get from cache first
    const cached = await this.getCached<WordPressPost[]>(cacheKey);
    if (cached) {
      console.log(`[WordPress API] Cache hit for products`);
      return cached;
    }

    try {
      const response: AxiosResponse<WordPressPost[]> = await this.client.get('/wp/v2/posts', {
        params: {
          _embed: true,
          ...params,
        },
      });
      
      // Cache the result for 5 minutes
      await this.setCached(cacheKey, response.data, 300);
      
      return response.data;
    } catch (error) {
      console.error('[WordPress API] Error fetching products:', error);
      throw new Error('Failed to fetch products from WordPress');
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/wp/v2/');
      return response.status === 200;
    } catch (error) {
      console.error('[WordPress API] Health check failed:', error);
      return false;
    }
  }
}

// Default WordPress API instance
export const createWordPressAPI = (config: WordPressConfig): WordPressAPI => {
  return new WordPressAPI(config);
};

// Singleton instance (will be initialized with environment variables)
let wordPressAPIInstance: WordPressAPI | null = null;

export const getWordPressAPI = (): WordPressAPI => {
  if (!wordPressAPIInstance) {
    const baseURL = process.env.WORDPRESS_API_URL || 'https://placeholder.com/wp-json';
    wordPressAPIInstance = createWordPressAPI({
      baseURL,
      timeout: 10000,
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
      },
    });
  }
  return wordPressAPIInstance;
}; 
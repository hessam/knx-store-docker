export interface WordPressProduct {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  slug: string;
  status: string;
  product_cat?: string[];
  meta?: { sku?: string };
  class_list?: Record<string, string>;
  featured_media?: number | null;
}

export interface TransformedProduct {
  id: number;
  title: string;
  description: string;
  slug: string;
  sku: string;
  price: string;
  category: string;
  image: number | null;
  specs: Record<string, string>;
}

export async function fetchProducts(): Promise<TransformedProduct[]> {
  try {
    const response = await fetch('https://mohtavaly.com/wp-json/wp/v2/product?per_page=100');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const products: WordPressProduct[] = await response.json();
    
    // Transform WordPress data to match your needs
    return products.map(product => {
      // Generate realistic prices based on product ID
      const basePrice = 50 + (product.id % 500); // Price range: $50-$550
      const price = (basePrice + (product.id * 10) % 100).toFixed(2); // Add some variation
      
      return {
        id: product.id,
        slug: product.slug,
        title: product.title.rendered,
        description: product.content.rendered,
        sku: product.meta?.sku || `SKU-${product.id}`,
        price: price,
        category: product.product_cat?.[0] || 'uncategorized',
        image: product.featured_media || null,
        specs: {
          'Product Type': Object.values(product.class_list || {}).includes('virtual') ? 'Digital Product' : 'Physical Product',
          'Status': product.status,
          'SKU': product.meta?.sku || `SKU-${product.id}`,
          'Price': `$${price}`
        }
      };
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
} 
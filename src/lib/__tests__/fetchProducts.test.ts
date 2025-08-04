import { fetchProducts } from '../fetchProducts';
import { mockFetchResponse, mockFetchError } from '../../test/setup';

describe('fetchProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch products successfully', async () => {
    const mockProducts = [
      {
        id: 1,
        title: { rendered: 'Test Product 1' },
        content: { rendered: 'Test description' },
        slug: 'test-product-1',
        status: 'publish',
        product_cat: ['category1'],
        meta: { sku: 'SKU-001' },
        class_list: { physical: 'physical' },
        featured_media: 123
      },
      {
        id: 2,
        title: { rendered: 'Test Product 2' },
        content: { rendered: 'Test description 2' },
        slug: 'test-product-2',
        status: 'publish',
        product_cat: ['category2'],
        meta: { sku: 'SKU-002' },
        class_list: { virtual: 'virtual' },
        featured_media: 456
      }
    ];

    mockFetchResponse(mockProducts);

    const result = await fetchProducts();

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: 1,
      title: 'Test Product 1',
      description: 'Test description',
      slug: 'test-product-1',
      sku: 'SKU-001',
      price: expect.any(String),
      category: 'category1',
      image: 123,
      specs: {
        'Product Type': 'Physical Product',
        'Status': 'publish',
        'SKU': 'SKU-001',
        'Price': expect.stringMatching(/^\$\d+\.\d{2}$/)
      }
    });

    expect(global.fetch).toHaveBeenCalledWith(
      'https://mohtavaly.com/wp-json/wp/v2/product?per_page=100'
    );
  });

  it('should handle API errors gracefully', async () => {
    mockFetchError('API Error', 500);

    await expect(fetchProducts()).rejects.toThrow('API Error');
  });

  it('should handle empty response', async () => {
    mockFetchResponse([]);

    const result = await fetchProducts();

    expect(result).toEqual([]);
  });

  it('should generate realistic prices based on product ID', async () => {
    const mockProducts = [
      {
        id: 1,
        title: { rendered: 'Product 1' },
        content: { rendered: 'Description' },
        slug: 'product-1',
        status: 'publish',
        product_cat: ['category1'],
        meta: { sku: 'SKU-001' },
        class_list: { physical: 'physical' },
        featured_media: null
      }
    ];

    mockFetchResponse(mockProducts);

    const result = await fetchProducts();

    expect(result[0].price).toMatch(/^\d+\.\d{2}$/);
    expect(parseFloat(result[0].price)).toBeGreaterThan(0);
  });

  it('should handle missing optional fields', async () => {
    const mockProducts = [
      {
        id: 1,
        title: { rendered: 'Product 1' },
        content: { rendered: 'Description' },
        slug: 'product-1',
        status: 'publish'
      }
    ];

    mockFetchResponse(mockProducts);

    const result = await fetchProducts();

    expect(result[0]).toEqual({
      id: 1,
      title: 'Product 1',
      description: 'Description',
      slug: 'product-1',
      sku: 'SKU-1',
      price: expect.any(String),
      category: 'uncategorized',
      image: null,
      specs: {
        'Product Type': 'Physical Product',
        'Status': 'publish',
        'SKU': 'SKU-1',
        'Price': expect.stringMatching(/^\$\d+\.\d{2}$/)
      }
    });
  });
}); 
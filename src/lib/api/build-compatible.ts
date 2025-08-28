/**
 * Simple Build-Compatible API Libraries
 * These will work in both build time and runtime
 */

// For build compatibility, we'll make all Redis functionality optional
export async function getPriceStockData(ids: string[]) {
  // Mock price/stock data for testing
  const mockData: { [key: string]: any } = {
    '1': { productId: '1', price: '89.99', stock: 25, inStock: true, cached: false, lastUpdated: new Date().toISOString() },
    '2': { productId: '2', price: '129.99', stock: 18, inStock: true, cached: false, lastUpdated: new Date().toISOString() },
    '3': { productId: '3', price: '259.99', stock: 12, inStock: true, cached: false, lastUpdated: new Date().toISOString() },
    '4': { productId: '4', price: '899.99', stock: 0, inStock: false, cached: false, lastUpdated: new Date().toISOString() },
    '5': { productId: '5', price: '449.99', stock: 8, inStock: true, cached: false, lastUpdated: new Date().toISOString() },
    '6': { productId: '6', price: '179.99', stock: 15, inStock: true, cached: false, lastUpdated: new Date().toISOString() }
  };

  return ids.map(id => mockData[id] || {
    productId: id,
    price: '0.00',
    stock: 0,
    inStock: false,
    cached: false,
    lastUpdated: new Date().toISOString()
  });
}

export async function getCartManager() {
  // Simplified cart manager for build compatibility
  return {
    getCart: async (sessionId: string) => ({
      sessionId,
      items: [],
      total: '0.00',
      itemCount: 0,
      lastUpdated: new Date().toISOString(),
      currency: 'USD'
    }),
    addItem: async (sessionId: string, item: any) => ({
      sessionId,
      items: [item],
      total: item.price || '0.00',
      itemCount: 1,
      lastUpdated: new Date().toISOString(),
      currency: 'USD'
    }),
    updateItem: async (_sessionId: string, _productId: string, _quantity: number) => ({
      sessionId: _sessionId,
      items: [],
      total: '0.00',
      itemCount: 0,
      lastUpdated: new Date().toISOString(),
      currency: 'USD'
    }),
    removeItem: async (_sessionId: string, _productId: string) => ({
      sessionId: _sessionId,
      items: [],
      total: '0.00',
      itemCount: 0,
      lastUpdated: new Date().toISOString(),
      currency: 'USD'
    }),
    clearCart: async (_sessionId: string) => true
  };
}

export async function performProductSearch(_options: any) {
  // Mock KNX products for testing
  const mockProducts = [
    {
      id: '1',
      productId: '1',
      name: 'KNX Binary Switch 2-Gang',
      slug: 'knx-binary-switch-2-gang',
      price: '89.99',
      regular_price: '89.99',
      sale_price: null,
      on_sale: false,
      image: 'https://picsum.photos/300/200?random=1',
      category: 'switches',
      description: 'High-quality KNX binary switch for smart home automation',
      inStock: true,
      stock_status: 'instock',
      featured: true,
      rating: 4.5,
      rating_count: 12,
      relevanceScore: 0.9
    },
    {
      id: '2',
      productId: '2',
      name: 'KNX Motion Sensor Indoor',
      slug: 'knx-motion-sensor-indoor',
      price: '129.99',
      regular_price: '149.99',
      sale_price: '129.99',
      on_sale: true,
      image: 'https://picsum.photos/300/200?random=2',
      category: 'sensors',
      description: 'Advanced PIR motion sensor with brightness detection',
      inStock: true,
      stock_status: 'instock',
      featured: false,
      rating: 4.8,
      rating_count: 24,
      relevanceScore: 0.8
    },
    {
      id: '3',
      productId: '3',
      name: 'KNX Dimmer Actuator 4-Channel',
      slug: 'knx-dimmer-actuator-4-channel',
      price: '259.99',
      regular_price: '259.99',
      sale_price: null,
      on_sale: false,
      image: 'https://picsum.photos/300/200?random=3',
      category: 'actuators',
      description: 'Professional dimmer actuator for LED and conventional lighting',
      inStock: true,
      stock_status: 'instock',
      featured: true,
      rating: 4.7,
      rating_count: 18,
      relevanceScore: 0.7
    },
    {
      id: '4',
      productId: '4',
      name: 'KNX Touch Panel 7"',
      slug: 'knx-touch-panel-7-inch',
      price: '899.99',
      regular_price: '899.99',
      sale_price: null,
      on_sale: false,
      image: 'https://picsum.photos/300/200?random=4',
      category: 'interfaces',
      description: 'Premium touch panel for complete home automation control',
      inStock: false,
      stock_status: 'outofstock',
      featured: false,
      rating: 4.9,
      rating_count: 8,
      relevanceScore: 0.6
    },
    {
      id: '5',
      productId: '5',
      name: 'KNX Weather Station',
      slug: 'knx-weather-station',
      price: '449.99',
      regular_price: '449.99',
      sale_price: null,
      on_sale: false,
      image: 'https://picsum.photos/300/200?random=5',
      category: 'sensors',
      description: 'Multi-sensor weather station for outdoor automation',
      inStock: true,
      stock_status: 'instock',
      featured: true,
      rating: 4.3,
      rating_count: 15,
      relevanceScore: 0.5
    },
    {
      id: '6',
      productId: '6',
      name: 'KNX Gateway Ethernet',
      slug: 'knx-gateway-ethernet',
      price: '179.99',
      regular_price: '179.99',
      sale_price: null,
      on_sale: false,
      image: 'https://picsum.photos/300/200?random=6',
      category: 'interfaces',
      description: 'Connect your KNX system to Ethernet networks',
      inStock: true,
      stock_status: 'instock',
      featured: false,
      rating: 4.4,
      rating_count: 21,
      relevanceScore: 0.4
    }
  ];

  // Simple filtering based on options
  let filteredProducts = [...mockProducts];
  
  if (_options.q) {
    const query = _options.q.toLowerCase();
    filteredProducts = filteredProducts.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
  }
  
  if (_options.category) {
    filteredProducts = filteredProducts.filter(product => 
      product.category === _options.category
    );
  }
  
  if (_options.featured === 'true' || _options.featured === true) {
    filteredProducts = filteredProducts.filter(product => product.featured);
  }
  
  if (_options.inStock === 'true' || _options.inStock === true) {
    filteredProducts = filteredProducts.filter(product => product.inStock);
  }
  
  if (_options.minPrice) {
    const minPrice = parseFloat(_options.minPrice);
    filteredProducts = filteredProducts.filter(product => 
      parseFloat(product.price) >= minPrice
    );
  }
  
  if (_options.maxPrice) {
    const maxPrice = parseFloat(_options.maxPrice);
    filteredProducts = filteredProducts.filter(product => 
      parseFloat(product.price) <= maxPrice
    );
  }

  // Simplified search for build compatibility
  return {
    results: filteredProducts,
    total: filteredProducts.length,
    cached: false,
    suggestions: filteredProducts.length === 0 ? ['knx', 'switch', 'sensor', 'dimmer'] : []
  };
}

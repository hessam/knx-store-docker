import '@testing-library/jest-dom';

// Mock environment variables for testing
process.env.WORDPRESS_API_URL = 'https://test-wordpress.com/wp-json';
process.env.WOOCOMMERCE_CONSUMER_KEY = 'test_consumer_key';
process.env.WOOCOMMERCE_CONSUMER_SECRET = 'test_consumer_secret';
process.env.STRIPE_PUBLISHABLE_KEY = 'pk_test_test_key';
process.env.STRIPE_SECRET_KEY = 'sk_test_test_key';
process.env.SENDGRID_API_KEY = 'test_sendgrid_key';
process.env.GOOGLE_API_KEY = 'test_google_key';
process.env.GOOGLE_SHEET_ID = 'test_sheet_id';
process.env.GTM_ID = 'GTM-TEST';

// Mock fetch globally
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock Stripe
jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn(() => Promise.resolve({
    elements: jest.fn(() => ({
      create: jest.fn(() => ({
        mount: jest.fn(),
        on: jest.fn(),
        unmount: jest.fn(),
      })),
    })),
    confirmCardPayment: jest.fn(() => Promise.resolve({ paymentIntent: { id: 'test_pi' } })),
    redirectToCheckout: jest.fn(() => Promise.resolve({ error: null })),
  })),
}));

// Mock WooCommerce API
jest.mock('woocommerce-api', () => {
  return jest.fn().mockImplementation(() => ({
    get: jest.fn(() => Promise.resolve({ data: [] })),
    post: jest.fn(() => Promise.resolve({ data: { id: 123 } })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} })),
  }));
});

// Mock SendGrid
jest.mock('@sendgrid/mail', () => ({
  setApiKey: jest.fn(),
  send: jest.fn(() => Promise.resolve([{ statusCode: 202 }])),
}));

// Mock Google APIs
jest.mock('googleapis', () => ({
  google: {
    sheets: jest.fn(() => ({
      spreadsheets: {
        values: {
          append: jest.fn(() => Promise.resolve({ data: {} })),
        },
      },
    })),
  },
}));

// Setup test utilities
export const mockFetchResponse = (data: any, status = 200) => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
    text: async () => JSON.stringify(data),
  });
};

export const mockFetchError = (error: string, status = 500) => {
  (global.fetch as jest.Mock).mockRejectedValueOnce(new Error(error));
};

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
  localStorageMock.clear();
  sessionStorageMock.clear();
}); 
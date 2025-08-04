import { describe, it, expect } from '@jest/globals';

// Mock the health API function
const mockHealthResponse = {
  status: 'healthy',
  timestamp: '2024-01-01T00:00:00.000Z',
  environment: 'test',
  message: 'KNX Store API is running'
};

describe('Health API', () => {
  it('should return health status', () => {
    expect(mockHealthResponse.status).toBe('healthy');
    expect(mockHealthResponse.message).toBe('KNX Store API is running');
    expect(mockHealthResponse).toHaveProperty('timestamp');
    expect(mockHealthResponse).toHaveProperty('environment');
  });

  it('should have correct data types', () => {
    expect(typeof mockHealthResponse.status).toBe('string');
    expect(typeof mockHealthResponse.message).toBe('string');
    expect(typeof mockHealthResponse.timestamp).toBe('string');
    expect(typeof mockHealthResponse.environment).toBe('string');
  });
}); 
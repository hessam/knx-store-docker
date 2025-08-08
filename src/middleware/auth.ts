import type { APIContext } from 'astro';
import jwt from 'jsonwebtoken';

// In-memory user store for development
export const users = new Map([
  ['admin@knxstore.com', { 
    id: 1, 
    email: 'admin@knxstore.com', 
    password: 'admin123', // In production, use hashed passwords
    name: 'Admin User',
    role: 'admin'
  }],
  ['user@knxstore.com', { 
    id: 2, 
    email: 'user@knxstore.com', 
    password: 'user123',
    name: 'Test User',
    role: 'user'
  }]
]);

export interface AuthenticatedUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

export function verifyToken(token: string): AuthenticatedUser | null {
  try {
    const secret = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
    const decoded = jwt.verify(token, secret) as AuthenticatedUser;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export function generateToken(user: AuthenticatedUser): string {
  const secret = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
  return jwt.sign(user, secret, { expiresIn: '24h' });
}

export function getAuthToken(context: APIContext): string | null {
  // Check Authorization header
  const authHeader = context.request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Check cookies
  const token = context.request.headers.get('cookie')?.match(/auth-token=([^;]+)/)?.[1];
  if (token) {
    return decodeURIComponent(token);
  }

  return null;
}

export function requireAuth(context: APIContext): AuthenticatedUser {
  const token = getAuthToken(context);
  if (!token) {
    throw new Error('Authentication required');
  }

  const user = verifyToken(token);
  if (!user) {
    throw new Error('Invalid or expired token');
  }

  return user;
}

export function optionalAuth(context: APIContext): AuthenticatedUser | null {
  try {
    return requireAuth(context);
  } catch {
    return null;
  }
} 
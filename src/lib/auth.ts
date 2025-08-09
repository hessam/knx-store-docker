import jwt, { type Secret } from 'jsonwebtoken';
import { serialize, parse } from 'cookie';

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface UserToken {
  id: number | string;
  email: string;
}

export function generateToken(user: UserToken): string {
  return (jwt as any).sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): UserToken | null {
  try {
    const decoded = (jwt as any).verify(token, JWT_SECRET) as any;
    return { id: decoded.userId, email: decoded.email };
  } catch {
    return null;
  }
}

export function createAuthCookie(token: string): string {
  return serialize('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
}

export function clearAuthCookie(): string {
  return serialize('auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });
}

export function getUserFromRequest(request: Request): UserToken | null {
  const cookies = parse(request.headers.get('cookie') || '');
  const token = cookies['auth-token'];
  if (!token) return null;
  return verifyToken(token);
}


import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

// Self-contained in serverless function to avoid cross-package TS bundling issues
const USERS = new Map([
  ['admin@knxstore.com', { id: 1, email: 'admin@knxstore.com', password: 'admin123' }],
  ['user@knxstore.com', { id: 2, email: 'user@knxstore.com', password: 'user123' }],
]);

function generateToken(payload: { id: number; email: string }): string {
  const secret = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
  return (jwt as any).sign({ userId: payload.id, email: payload.email }, secret, { expiresIn: '7d' });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { email, password } = (req.body && typeof req.body === 'object') ? req.body : JSON.parse(req.body || '{}');
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const user = USERS.get(email);
    if (!user || user.password !== password) return res.status(401).json({ error: 'Invalid credentials' });

    const token = generateToken({ id: user.id, email: user.email });
    const cookie = `auth-token=${token}; HttpOnly; Path=/; SameSite=Strict${process.env.NODE_ENV==='production'?'; Secure':''}; Max-Age=${60*60*24*7}`;
    res.setHeader('Set-Cookie', cookie);
    return res.status(200).json({ success: true, user: { id: user.id, email: user.email } });
  } catch (e: any) {
    console.error('Login function error:', e?.message || e);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


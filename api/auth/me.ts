import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const cookies = req.headers.cookie || '';
    const token = cookies.split(';').map(c => c.trim()).find(c => c.startsWith('auth-token='))?.split('=')[1];
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    const secret = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
    const decoded = (jwt as any).verify(token, secret) as any;
    const user = { id: decoded.userId, email: decoded.email };
    return res.status(200).json({ user });
  } catch (e) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
}


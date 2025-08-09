import type { VercelRequest, VercelResponse } from '@vercel/node';
import { users } from '../../src/middleware/auth';
import { generateToken } from '../../src/lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const user = users.get(email);
    if (!user || user.password !== password) return res.status(401).json({ error: 'Invalid credentials' });
    const token = generateToken({ id: user.id, email: user.email });
    res.setHeader('Set-Cookie', `auth-token=${token}; HttpOnly; Path=/; SameSite=Strict${process.env.NODE_ENV==='production'?'; Secure':''}`);
    return res.status(200).json({ success: true, user: { id: user.id, email: user.email } });
  } catch (e) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}


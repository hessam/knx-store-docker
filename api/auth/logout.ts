import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const cookie = `auth-token=; HttpOnly; Path=/; SameSite=Strict${process.env.NODE_ENV==='production'?'; Secure':''}; Max-Age=0`;
    res.setHeader('Set-Cookie', cookie);
    return res.status(200).json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}


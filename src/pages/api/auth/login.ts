import type { APIRoute } from 'astro';
import { generateToken, createAuthCookie } from '../../../lib/auth';
import { users } from '../../../middleware/auth';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const user = users.get(email);
    if (!user || user.password !== password) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const token = generateToken({ id: user.id, email: user.email });
    const cookie = createAuthCookie(token);

    return new Response(JSON.stringify({ success: true, user: { id: user.id, email: user.email } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Set-Cookie': cookie },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};


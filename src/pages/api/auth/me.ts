import type { APIRoute } from 'astro';
import { getUserFromRequest } from '../../../lib/auth';

export const GET: APIRoute = async ({ request }) => {
  const user = getUserFromRequest(request);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }
  return new Response(JSON.stringify({ user }), { status: 200, headers: { 'Content-Type': 'application/json' } });
};


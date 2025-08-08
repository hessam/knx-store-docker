import type { APIRoute } from 'astro';
import { requireAuth } from '../../middleware/auth';

export const GET: APIRoute = async (context) => {
  try {
    const user = requireAuth(context);
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Protected endpoint accessed successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Authentication required' 
    }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

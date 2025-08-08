import type { APIRoute } from 'astro';
import { users, generateToken, AuthenticatedUser } from '../../middleware/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return new Response(JSON.stringify({ 
        error: 'Email and password are required' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if user exists
    const user = users.get(email);
    if (!user || user.password !== password) {
      return new Response(JSON.stringify({ 
        error: 'Invalid email or password' 
      }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate JWT token
    const userData: AuthenticatedUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    const token = generateToken(userData);

    // Set secure HTTP-only cookie
    cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    });

    return new Response(JSON.stringify({
      success: true,
      user: userData,
      message: 'Login successful'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const GET: APIRoute = async ({ cookies }) => {
  try {
    const token = cookies.get('auth-token')?.value;
    
    if (!token) {
      return new Response(JSON.stringify({ 
        authenticated: false 
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verify token
    const { verifyToken } = await import('../../middleware/auth');
    const user = verifyToken(token);

    if (!user) {
      // Clear invalid token
      cookies.delete('auth-token');
      return new Response(JSON.stringify({ 
        authenticated: false 
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      authenticated: true,
      user
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Auth check error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}; 
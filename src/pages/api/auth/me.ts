export const GET = async ({ request, cookies }: any) => {
  try {
    // Check for session cookie
    const sessionId = cookies.get('session-id')?.value;
    
    if (!sessionId) {
      return new Response(JSON.stringify({
        authenticated: false,
        user: null,
        message: 'No session found'
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    }

    // For now, return a basic authenticated state
    // In a real app, you'd validate the session against a database
    return new Response(JSON.stringify({
      authenticated: true,
      user: {
        id: sessionId,
        email: 'user@example.com',
        name: 'Guest User'
      },
      sessionId,
      metadata: {
        timestamp: new Date().toISOString(),
        responseTime: Date.now() % 100
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'private, max-age=300' // 5 minutes
      }
    });

  } catch (error) {
    console.error('Auth check error:', error);
    
    return new Response(JSON.stringify({
      authenticated: false,
      user: null,
      error: 'Authentication check failed',
      metadata: {
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  }
};

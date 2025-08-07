import type { APIRoute } from 'astro';
import { saveCustomTranslation } from '../../lib/i18n';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const lang = formData.get('lang') as string;
    const key = formData.get('key') as string;
    const value = formData.get('value') as string;

    // Validate inputs
    if (!lang || !key || !value) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Missing required fields' 
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Save the translation
    const success = saveCustomTranslation(lang, key, value);

    if (success) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Translation saved successfully' 
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Failed to save translation' 
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  } catch (error) {
    console.error('Error saving translation:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Internal server error' 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

export const OPTIONS: APIRoute = () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}; 
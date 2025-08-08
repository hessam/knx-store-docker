import type { APIRoute } from 'astro';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { 
  apiVersion: '2023-10-16' 
});

const validCurrencies = ['usd', 'eur', 'aed'];

export const POST: APIRoute = async ({ request }) => {
  try {
    const { amount, currency = 'usd', productId, customerEmail } = await request.json();

    // Validate input
    if (!amount || amount <= 0) {
      return new Response(JSON.stringify({ error: 'Invalid amount' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!validCurrencies.includes(currency)) {
      return new Response(JSON.stringify({ error: 'Invalid currency' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      automatic_payment_methods: { enabled: true },
      metadata: {
        productId: productId || 'unknown',
        customerEmail: customerEmail || 'anonymous'
      }
    });

    return new Response(JSON.stringify({ 
      clientSecret: paymentIntent.client_secret 
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Payment error:', error);
    return new Response(JSON.stringify({ 
      error: 'Payment processing failed' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}; 
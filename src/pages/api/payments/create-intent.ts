import type { APIRoute } from 'astro';
import { stripe, CURRENCIES, validateAmount } from '../../../lib/stripe';
import { getUserFromRequest } from '../../../lib/auth';

export const POST: APIRoute = async ({ request }) => {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const { amount, currency, description } = await request.json();
    const code = (currency || 'USD').toUpperCase() as keyof typeof CURRENCIES;
    if (!CURRENCIES[code]) {
      return new Response(JSON.stringify({ error: 'Unsupported currency' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    if (!validateAmount(Number(amount), code)) {
      const min = CURRENCIES[code].minimumAmount;
      return new Response(JSON.stringify({ error: `Minimum amount is ${min / 100} ${code}` }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const intent = await stripe.paymentIntents.create({
      amount: Number(amount),
      currency: CURRENCIES[code].code,
      description: description || 'Payment',
      metadata: { userId: String(user.id), userEmail: user.email },
      automatic_payment_methods: { enabled: true },
    });

    return new Response(JSON.stringify({ clientSecret: intent.client_secret, publishableKey: process.env.STRIPE_PUBLISHABLE_KEY }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('Payment intent error:', err);
    return new Response(JSON.stringify({ error: 'Payment setup failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};


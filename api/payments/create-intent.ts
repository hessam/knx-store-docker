import type { VercelRequest, VercelResponse } from '@vercel/node';
import { stripe, CURRENCIES, validateAmount } from '../../src/lib/stripe';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { amount, currency = 'USD', description } = req.body || {};
    const code = String(currency).toUpperCase() as keyof typeof CURRENCIES;
    if (!CURRENCIES[code]) return res.status(400).json({ error: 'Unsupported currency' });
    if (!validateAmount(Number(amount), code)) {
      const min = CURRENCIES[code].minimumAmount;
      return res.status(400).json({ error: `Minimum amount is ${min / 100} ${code}` });
    }
    const intent = await stripe.paymentIntents.create({
      amount: Number(amount),
      currency: CURRENCIES[code].code,
      description: description || 'Payment',
      automatic_payment_methods: { enabled: true },
    });
    return res.status(200).json({ clientSecret: intent.client_secret, publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
  } catch (e) {
    console.error('Serverless create-intent error:', e);
    return res.status(500).json({ error: 'Payment setup failed' });
  }
}


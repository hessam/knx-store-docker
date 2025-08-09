import Stripe from 'stripe';

const secretKey = process.env.STRIPE_SECRET_KEY || '';
export const stripe = new Stripe(secretKey, { apiVersion: '2023-10-16' });

export const CURRENCIES = {
  USD: { code: 'usd', symbol: '$', minimumAmount: 50 },
  EUR: { code: 'eur', symbol: '€', minimumAmount: 50 },
  AED: { code: 'aed', symbol: 'د.إ', minimumAmount: 200 },
} as const;

export function validateAmount(amount: number, currency: keyof typeof CURRENCIES): boolean {
  const cfg = CURRENCIES[currency];
  return typeof amount === 'number' && amount >= cfg.minimumAmount;
}


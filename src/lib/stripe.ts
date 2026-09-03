import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';

export function isStripeConfigured(): boolean {
  return (
    Boolean(stripeSecretKey) &&
    !stripeSecretKey.includes('your_stripe_secret_key') &&
    stripeSecretKey.startsWith('sk_')
  );
}

let stripeInstance: Stripe | null = null;

export function getStripeServerClient(): Stripe | null {
  if (typeof window !== 'undefined') {
    console.error('getStripeServerClient must NEVER be called on the client side');
    return null;
  }
  if (!isStripeConfigured()) {
    return null;
  }
  if (!stripeInstance) {
    stripeInstance = new Stripe(stripeSecretKey, {
      apiVersion: '2026-07-29.dahlia',
    });
  }
  return stripeInstance;
}

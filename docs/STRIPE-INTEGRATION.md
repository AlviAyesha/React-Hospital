# Stripe Integration Architecture

## Configuration & API Routes

Stripe operations are processed server-side through dedicated Next.js API routes using official Stripe Node SDK (`stripe`).

| Route | Method | Access | Function |
|-------|--------|--------|----------|
| `/api/stripe/checkout` | `POST` | Authenticated | Creates a Stripe Checkout subscription session (`mode: 'subscription'`). |
| `/api/stripe/portal` | `POST` | Authenticated | Creates a Stripe Customer Billing Portal session for managing subscriptions. |
| `/api/stripe/webhook` | `POST` | Public | Signature-verified webhook endpoint for processing Stripe events. |

## Signature Verification

The webhook handler in `/api/stripe/webhook/route.ts` enforces signature verification:

```ts
const rawBody = await req.text();
const signature = req.headers.get('stripe-signature');
const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
```

Unverified events are rejected immediately with a `400 Bad Request` HTTP status.

## Event Handlers

- `checkout.session.completed`: Upgrades user profile to `plan = 'pro'`, sets `subscription_status = 'active'`, and stores `stripe_customer_id` & `stripe_subscription_id`.
- `customer.subscription.created` / `customer.subscription.updated`: Updates `subscription_status` and `current_period_end`.
- `customer.subscription.deleted`: Downgrades user profile to `plan = 'free'` and sets `subscription_status = 'canceled'`.
- `invoice.payment_failed`: Sets `subscription_status = 'past_due'`.

## Local Fallback Simulation

When Stripe environment variables (`STRIPE_SECRET_KEY`) are missing:
- Checkout requests return a simulated redirect `{ simulated: true }`.
- Client `authContext` updates the local user profile plan to `'pro'`.
- Enables full testing of Pro features without live API credentials.

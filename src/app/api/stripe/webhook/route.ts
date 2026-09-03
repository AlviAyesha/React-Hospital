import { Stripe } from 'stripe';
import { getStripeServerClient, isStripeConfigured } from '@/lib/stripe';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  if (!isStripeConfigured()) {
    return new Response(JSON.stringify({ error: "Stripe unconfigured" }), { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
  if (!webhookSecret || webhookSecret.includes('your_stripe_webhook_secret')) {
    return new Response(JSON.stringify({ error: "Stripe webhook secret is missing" }), { status: 400 });
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return new Response(JSON.stringify({ error: "Missing stripe-signature header" }), { status: 400 });
  }

  const stripe = getStripeServerClient();
  if (!stripe) {
    return new Response(JSON.stringify({ error: "Stripe client unavailable" }), { status: 500 });
  }

  let event: Stripe.Event;

  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    console.error(`[Stripe Webhook Signature Verification Failed]: ${errorMsg}`);
    return new Response(`Webhook Error: Signature Verification Failed — ${errorMsg}`, { status: 400 });
  }

  const adminSupabase = getSupabaseAdminClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;
        const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;

        if (userId && adminSupabase) {
          await adminSupabase.from('profiles').update({
            plan: 'pro',
            subscription_status: 'active',
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
          }).eq('id', userId);
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer?.id;
        const status = subscription.status; // 'active' | 'trialing' | 'past_due' | 'canceled' | etc.
        const rawPeriodEnd = (subscription as unknown as { current_period_end?: number }).current_period_end;
        const currentPeriodEnd = rawPeriodEnd ? new Date(rawPeriodEnd * 1000).toISOString() : new Date().toISOString();
        const plan = (status === 'active' || status === 'trialing') ? 'pro' : 'free';

        if (customerId && adminSupabase) {
          await adminSupabase.from('profiles').update({
            plan,
            subscription_status: status,
            stripe_subscription_id: subscription.id,
            current_period_end: currentPeriodEnd,
          }).eq('stripe_customer_id', customerId);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer?.id;

        if (customerId && adminSupabase) {
          await adminSupabase.from('profiles').update({
            plan: 'free',
            subscription_status: 'canceled',
          }).eq('stripe_customer_id', customerId);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id;

        if (customerId && adminSupabase) {
          await adminSupabase.from('profiles').update({
            subscription_status: 'past_due',
          }).eq('stripe_customer_id', customerId);
        }
        break;
      }

      default:
        // Unhandled event type
        break;
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (error) {
    console.error("[Stripe Webhook Event Processing Error]:", error);
    return new Response(JSON.stringify({ error: "Webhook handler failed" }), { status: 500 });
  }
}

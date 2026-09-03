import { getStripeServerClient, isStripeConfigured } from '@/lib/stripe';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const { userId, email } = await req.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: "User ID is required" }), { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Safe fallback if Stripe keys are unconfigured
    if (!isStripeConfigured()) {
      if (process.env.NODE_ENV === 'production') {
        return new Response(JSON.stringify({ error: "Billing system is currently unconfigured." }), { status: 500 });
      }
      console.warn("[Stripe Checkout] Stripe unconfigured, simulating Pro upgrade.");
      return new Response(
        JSON.stringify({
          url: `${baseUrl}/dashboard?subscription=simulated_pro`,
          simulated: true,
          message: "Stripe unconfigured. Upgrade simulated for local dev.",
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const stripe = getStripeServerClient();
    if (!stripe) {
      return new Response(JSON.stringify({ error: "Stripe client initialization failed" }), { status: 500 });
    }

    let customerId: string | undefined;

    // Fetch existing customer ID from Supabase profile if available
    const adminSupabase = getSupabaseAdminClient();
    if (adminSupabase) {
      const { data: profile } = await adminSupabase
        .from('profiles')
        .select('stripe_customer_id')
        .eq('id', userId)
        .single();
      if (profile?.stripe_customer_id) {
        customerId = profile.stripe_customer_id;
      }
    }

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: email || undefined,
        metadata: { userId },
      });
      customerId = customer.id;

      if (adminSupabase) {
        await adminSupabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', userId);
      }
    }

    const priceId = process.env.STRIPE_PRO_MONTHLY_PRICE_ID || 'price_placeholder';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/dashboard?subscription=success`,
      cancel_url: `${baseUrl}/pricing?subscription=canceled`,
      metadata: { userId },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("[Stripe Checkout Error]:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create checkout session." }),
      { status: 500 }
    );
  }
}

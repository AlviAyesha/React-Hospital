import { getStripeServerClient, isStripeConfigured } from '@/lib/stripe';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: "User ID is required" }), { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (!isStripeConfigured()) {
      if (process.env.NODE_ENV === 'production') {
        return new Response(JSON.stringify({ error: "Billing portal unavailable." }), { status: 500 });
      }
      return new Response(
        JSON.stringify({
          url: `${baseUrl}/dashboard?portal=simulated`,
          simulated: true,
          message: "Stripe unconfigured. Customer portal simulated.",
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const stripe = getStripeServerClient();
    if (!stripe) {
      return new Response(JSON.stringify({ error: "Stripe client unavailable" }), { status: 500 });
    }

    let customerId: string | undefined;

    const adminSupabase = getSupabaseAdminClient();
    if (adminSupabase) {
      const { data: profile } = await adminSupabase
        .from('profiles')
        .select('stripe_customer_id')
        .eq('id', userId)
        .single();
      customerId = profile?.stripe_customer_id;
    }

    if (!customerId) {
      return new Response(
        JSON.stringify({ error: "No active Stripe customer found for this account." }),
        { status: 404 }
      );
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${baseUrl}/dashboard`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("[Stripe Portal Error]:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create portal session." }),
      { status: 500 }
    );
  }
}

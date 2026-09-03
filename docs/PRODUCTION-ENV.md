# Production Environment Variables Reference

Configure these 9 variables in Vercel Project Settings > Environment Variables before triggering production builds.

| Variable Name | Exposure | Required For | Description | Example Value |
|---------------|----------|--------------|-------------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public (Client + Server) | Supabase Auth & DB | Base API URL of your Supabase project. | `https://xyzcompany.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public (Client + Server) | Supabase Client | Anon public key for client-side Auth and queries. | `eyJhbGciOiJIUzI1NiIsInR5cCI6...` |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server-Only** | Admin API Routes | Elevated service role key for profile updates & webhook sync. **Never expose to browser!** | `eyJhbGciOiJIUzI1NiIsInR5cCI6...` |
| `GOOGLE_GENERATIVE_AI_API_KEY` | **Server-Only** | Dr. React AI Mentor | Gemini 2.0 Flash API key for Dr. React hints and code evaluation. | `AIzaSyB...` |
| `STRIPE_SECRET_KEY` | **Server-Only** | Stripe API Routes | Stripe Secret API key for Checkout & Billing Portal sessions. | `sk_live_51...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Public (Client + Server) | Stripe Client | Stripe Publishable key for client SDK. | `pk_live_51...` |
| `STRIPE_WEBHOOK_SECRET` | **Server-Only** | Webhook Verification | Webhook signing secret (`whsec_...`) used to construct and verify Stripe signatures. | `whsec_...` |
| `STRIPE_PRO_MONTHLY_PRICE_ID` | Server-Side | Checkout API | Price ID for Pro Survivor Monthly Subscription ($19/mo). | `price_1Q...` |
| `NEXT_PUBLIC_APP_URL` | Public (Client + Server) | Redirects & Webhooks | Base domain URL of deployed production app. | `https://reacthospital.com` |

---

## Production Security Rules
1. **No Secret Leaks**: `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and `GOOGLE_GENERATIVE_AI_API_KEY` MUST NOT start with `NEXT_PUBLIC_`.
2. **Production Guardrails**: In production (`NODE_ENV === 'production'`), simulated local dev fallbacks for Stripe checkout/portal are automatically disabled to prevent unauthorized account upgrades.

# Vercel & Production Deployment Checklist — React Hospital

Follow this checklist to deploy React Hospital to production on Vercel with live Supabase database and Stripe subscription billing.

---

## 1. Pre-Deployment Verification
- [x] Run `npm run lint` locally (Ensure 0 errors and 0 warnings).
- [x] Run `npm run build` locally (Ensure all 21 static & dynamic routes compile).
- [x] Verify local fallback behavior works when environment variables are unconfigured.

---

## 2. Supabase Production Setup
- [ ] Log in to [Supabase Dashboard](https://database.new) and create a new production project.
- [ ] Open SQL Editor and execute the complete schema script in [`docs/SUPABASE-SCHEMA.md`](file:///d:/React-hospital/docs/SUPABASE-SCHEMA.md).
- [ ] Verify Row Level Security (RLS) is enabled on `profiles`, `bug_cases`, and `case_submissions`.
- [ ] Under **Authentication > URL Configuration**:
  - Set Site URL to `https://<your-vercel-domain>.vercel.app`.
  - Add Redirect URLs: `https://<your-vercel-domain>.vercel.app/**`.
- [ ] Copy project API keys:
  - Project URL (`NEXT_PUBLIC_SUPABASE_URL`)
  - anon / public key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
  - service_role secret key (`SUPABASE_SERVICE_ROLE_KEY`)

---

## 3. Stripe Production Setup
- [ ] Log in to [Stripe Dashboard](https://dashboard.stripe.com) and switch to **Live mode** (or Test mode for staging).
- [ ] Under **Products**, create a subscription product:
  - Name: **React Hospital Pro Survivor**
  - Billing period: Monthly ($19 / month)
  - Copy Price ID (`STRIPE_PRO_MONTHLY_PRICE_ID`).
- [ ] Under **Developers > Webhooks**, click **Add Endpoint**:
  - Endpoint URL: `https://<your-vercel-domain>.vercel.app/api/stripe/webhook`
  - Events to listen for:
    - `checkout.session.completed`
    - `customer.subscription.created`
    - `customer.subscription.updated`
    - `customer.subscription.deleted`
    - `invoice.payment_failed`
  - Copy Signing Secret (`STRIPE_WEBHOOK_SECRET`).
- [ ] Under **Settings > Customer Portal**, enable billing portal features (Subscription cancellation, Payment method updates).

---

## 4. Vercel Deployment & Environment Variables
- [ ] Connect your repository to Vercel (`Import Project`).
- [ ] In Vercel Project Settings > **Environment Variables**, add all 9 production variables (documented in [`docs/PRODUCTION-ENV.md`](file:///d:/React-hospital/docs/PRODUCTION-ENV.md)):
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `GOOGLE_GENERATIVE_AI_API_KEY`
  - `STRIPE_SECRET_KEY`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - `STRIPE_PRO_MONTHLY_PRICE_ID`
  - `NEXT_PUBLIC_APP_URL`
- [ ] Trigger Vercel Production Build (`git push main` or Click Deploy).

---

## 5. Post-Deployment Smoke Test
- [ ] Visit `https://<your-vercel-domain>.vercel.app`.
- [ ] Sign up a new student account (`/sign-up`).
- [ ] Complete onboarding flow (`/onboarding`) and select Dr. React preferences.
- [ ] Navigate to Emergency Ward (`/dashboard`) and launch a Code Green mission.
- [ ] Test Dr. React AI Mentor hints (`/api/mentor`).
- [ ] Test Pro upgrade CTA (`/pricing`) to verify Stripe Checkout redirect.
- [ ] Log in as admin user to verify `/admin/cases` route protection.

# Post-Deployment Maintenance & Production Status Checklist

## 1. Live Production Deployment Metadata

- **Production App URL**: `https://react-hospital.vercel.app`
- **Connected Supabase Project**: `rh-prod.supabase.co` (PostgreSQL 15, Auth enabled, RLS enforced)
- **Stripe Mode**: Test & Live Subscription Ready (`STRIPE_PRO_MONTHLY_PRICE_ID` active)
- **AI Mentor Provider**: Google Gemini 2.0 Flash (`google('gemini-2.0-flash')` with fallback offline hints)
- **Deployment Date**: August 24, 2026
- **Latest Build Status**: **21/21 static & dynamic routes compiled (0 errors, 0 warnings)**

---

## 2. Beta Cohort Activation Status (20–50 Students)

- [x] Beta Landing CTAs active (*"Join Beta — Start Free Debugging Mission"*).
- [x] App-wide Beta Feedback & Bug Reporting Modal active (`<BetaFeedbackModal />`).
- [x] Beta Learning Analytics active (`trackBetaEvent()`).
- [x] Admin Beta Activation Dashboard active (`/admin`).
- [x] First 5 Polished Seed Missions loaded (`c1` to `c5`).
- [x] Dr. React Quality Control guidelines documented in [`docs/DR-REACT-QA.md`](file:///d:/React-hospital/docs/DR-REACT-QA.md).
- [x] Beta Invite Copy templates created in [`docs/BETA-INVITE-COPY.md`](file:///d:/React-hospital/docs/BETA-INVITE-COPY.md).

---

## 3. Production Security Rules
- `SUPABASE_SERVICE_ROLE_KEY` and `STRIPE_SECRET_KEY` are configured strictly in Vercel environment settings and not exposed in client JS bundles.
- Simulated Stripe upgrades are strictly disabled in production (`NODE_ENV === 'production'`).
- RLS policies restrict students to reading/updating only their own `auth.uid() = id` progress.

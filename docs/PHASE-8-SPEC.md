# Phase 8 Specification — Pricing, Subscription Access Control, and Stripe Integration

## Overview
Phase 8 introduces monetization, subscription management, access control rules, and Stripe integration for React Hospital while preserving 100% local storage fallback and dev override capability.

## Completed Objectives

### 1. Subscription Data Model & Types
- Extended `Profile` in `src/lib/types.ts` with `plan`, `subscription_status`, `stripe_customer_id`, `stripe_subscription_id`, `current_period_end`.
- Extended `BugCase` with `access_level: 'free' | 'pro'`.

### 2. Access Control Infrastructure
- Created `src/lib/accessControl.ts`:
  - `canAccessCase(user, bugCase)`
  - `canUseAITutor(user, messageCount)` (cap: 5 messages for Free users)
  - `getPlanLimits(user)`

### 3. Stripe Server Routes & SDK
- Created `src/lib/stripe.ts` server SDK helper.
- Built `/api/stripe/checkout`: Creates subscription checkout session with fallback simulation for local testing.
- Built `/api/stripe/portal`: Redirects active subscribers to Stripe customer portal.
- Built `/api/stripe/webhook`: Signature-verified webhook handler processing `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`.

### 4. Pricing Page & UI Gating
- Built `/pricing` (`src/app/pricing/page.tsx`) with Free ($0) vs Pro ($19/mo) plans, feature breakdown, and checkout CTAs.
- Updated `/dashboard` to mark Pro cases with `PRO` badges and show upgrade CTAs.
- Updated mission editor (`/hospital/case/id` & `/hospital/case/[id]`) to lock Pro cases for Free users and cap AI tutor messages at 5 with inline upgrade alerts.

### 5. Admin Case Access Level
- Added Access Level dropdown (`Free` vs `Pro`) in `/admin/cases/new`.
- Added Access Level status badge in `/admin/cases`.

### 6. Mobile Billing Readiness
- Updated `mobile/app/tabs/profile.tsx` with subscription plan status and web upgrade CTA link.

---

## Verification Results
- Web Lint: `npm run lint` (PASSED)
- Web Production Build: `npm run build` (PASSED)
- Mobile Lint: `npm run lint` (PASSED)
- Mobile Typecheck: `npm run typecheck` (PASSED)

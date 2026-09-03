# Pricing & Monetization Specification

## Overview

React Hospital uses a freemium subscription model designed to lower the barrier to entry while monetizing advanced debugging missions and unlimited AI mentoring.

## Subscription Tiers

### 1. Free Starter Plan ($0 / month)
- Access to Level 1 / Beginner Bug Cases (Hydration errors, basic component loops).
- Cap of 5 AI CTO Mentor hints per mission.
- Basic XP and daily streak tracking.
- Standard skill memory overview.

### 2. Pro Survivor Plan ($19 / month)
- Access to ALL Bug Missions (Beginner + Advanced Stale Closures, Race Conditions, Server Components).
- Unlimited AI CTO Mentor messages.
- Advanced Skill Memory breakdown & weakness analytics.
- Priority solution evaluation.
- Certificate-ready progress tracking.

### 3. Team / Admin Plan (Future Phase)
- Multi-seat licenses for engineering bootcamps and team training.

## User Flow

```
                      +-------------------+
                      |   /pricing Page   |
                      +-------------------+
                                |
                   Click "Upgrade to Pro"
                                |
               +---------------------------------+
               |  POST /api/stripe/checkout       |
               +---------------------------------+
                                |
               Is STRIPE_SECRET_KEY Configured?
                                |
                 +--------------+--------------+
                 |                             |
             [ YES ]                        [ NO ]
                 |                             |
    Redirect to Stripe Checkout     Simulate Pro Upgrade
    Session URL                     for Local Development
                 |                             |
    Stripe Webhook Fires             Instant Local Upgrade
    (checkout.session.completed)    to Pro Plan
                 |                             |
    Update Supabase Profile        Update Local Profile State
    plan = 'pro'                    plan = 'pro'
```

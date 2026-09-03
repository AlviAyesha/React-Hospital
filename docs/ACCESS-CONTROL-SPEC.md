# Access Control Specification

## Overview

React Hospital enforces tier-based access control rules through `src/lib/accessControl.ts`.

## Access Rules Summary

| Access Rule | Admin User | Pro User | Free User | Unauthenticated |
|-------------|------------|----------|-----------|-----------------|
| Beginner Cases | Full Access | Full Access | Full Access | Full Access |
| Pro Cases | Full Access | Full Access | Locked (Upgrade CTA) | Locked (Sign In / Upgrade) |
| AI Tutor Messages | Unlimited | Unlimited | Cap: 5 per Mission | Cap: 5 per Mission |
| Skill Memory | Full Analytics | Full Analytics | Basic Overview | Basic Overview |
| Admin Routes (`/admin`) | Granted | Denied (403) | Denied (403) | Denied (403) |

## Implementation Methods

- `canAccessCase(user: Profile | null, bugCase: BugCase): boolean`
  - Returns `true` if `user.role === 'admin'`, or if `bugCase.access_level !== 'pro'`, or if `user.plan === 'pro'`.
- `canUseAITutor(user: Profile | null, currentUsageCount: number): boolean`
  - Returns `true` for `admin` and `pro` users. For `free` users, returns `currentUsageCount < 5`.
- `getPlanLimits(user: Profile | null)`
  - Returns structured plan limits used by UI components to display features.

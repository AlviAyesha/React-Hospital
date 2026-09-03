# Supabase Integration & Data Flow

## Overview

`src/lib/data.ts` acts as the unified data service for React Hospital. It abstracts persistence operations so that UI components remain agnostic of whether data is saved in Supabase or local storage.

## Data Layer Mapping

| Entity | Supabase Table | Fallback Storage | Sync Trigger |
|--------|----------------|------------------|--------------|
| Bug Cases | `public.bug_cases` | `localStorage: rh_custom_bug_cases` + Seed array | Admin creation / Case page lookup |
| Case Submissions | `public.case_submissions` | Memory array | `/api/submit` route |
| AI Feedback | `public.ai_feedback` | Memory array | `/api/submit` evaluation |
| Skill Memory | `public.skill_memory` | `localStorage: rh_skill_memory` | Solution evaluation & weakness detection |
| Student Progress | `public.student_progress` | `localStorage: rh_solved` | Solved case registration |
| Streaks | `public.streaks` | `localStorage: rh_streak` | Daily visit check & submission |
| XP Events | `public.xp_events` | `localStorage: rh_xp` | XP award event |

## Security Rules & Service Role Usage

1. **Browser Client (`src/lib/supabase/client.ts`)**
   - Uses `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   - Used for authenticated student requests and public reads under Row-Level Security (RLS).

2. **Admin Server Client (`src/lib/supabase/admin.ts`)**
   - Uses `SUPABASE_SERVICE_ROLE_KEY`.
   - Never bundled into client side javascript (`typeof window === 'undefined'` guard enforced).
   - Used exclusively for server-side administrative operations when required.

3. **Fallback Resiliency**
   - If Supabase API queries fail or throw network errors, `dataService` catches errors, logs a warning, and returns cached/local fallback data without crashing the client application.

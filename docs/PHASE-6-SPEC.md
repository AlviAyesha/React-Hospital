# Phase 6 Specification: Real Data + AI Tutor Core

## Objectives
- Transition React Hospital from a static mock MVP to a production-ready data abstraction architecture.
- Enable full admin case creation and persistent retrieval.
- Implement student submission processing with structured AI feedback & offline heuristic fallback.
- Maintain persistent student skill memory, XP events, and streak updates.
- Ensure strict compliance with Windows-safe static routing conventions (`/hospital/case/id?caseId=...`).

## Architecture & Data Abstraction (`src/lib/data.ts`)
The `dataService` exposes an async CRUD API covering all 12 core schema entities:
1. `profiles`
2. `bug_cases`
3. `case_submissions`
4. `ai_feedback`
5. `student_progress`
6. `skill_memory`
7. `streaks`
8. `xp_events`
9. `lessons`
10. `lesson_progress`
11. `code_challenges`
12. `challenge_attempts`

### Storage Strategy
- If `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY` are provided in `.env.local`, `dataService` uses the Supabase client.
- If Supabase environment variables are missing, `dataService` seamlessly falls back to persistent `localStorage` and memory stores on both Web and Mobile.

## AI Tutor Core & Coaching Guidelines
- **System Prompt**: Enforces hint-based coaching. No direct copy-paste solutions provided first.
- **Structured Feedback**: Every submission receives a evaluated response with:
  - `score` (0-100)
  - `what_is_wrong`
  - `what_is_correct`
  - `hint`
  - `fixed_concept`
  - `next_practice_task`
  - `weaknesses_detected`
- **Fallback Evaluation**: When AI API key is missing or quota limited, a local AST/diff heuristic evaluates submissions so learning flows never break.

## Concept Memory Tracking
Tracks mastery across 10 core frontend concepts:
1. `hydration`
2. `useEffect`
3. `props/state`
4. `server/client components`
5. `forms`
6. `API routes`
7. `auth`
8. `database`
9. `performance`
10. `SEO`

Every submission updates concept attempt counts, failure rates, and status (`weak` | `improving` | `strong`).

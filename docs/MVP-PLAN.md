# Full MVP Implementation Plan & Task List

## Overview
This document outlines the step-by-step task list to build the React Hospital / DevSurvival OS MVP.

## Phase 1: Project Initialization & Infrastructure
1. **Initialize Next.js App:** `npx create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
2. **Install UI Dependencies:** Install shadcn/ui and configure core components (Button, Card, Input, Label, Dialog, Toast).
3. **Setup Database (Supabase):** Create a new Supabase project, initialize tables as per `DATABASE-SCHEMA.md`, and set up Row Level Security (RLS) policies.
4. **Configure Authentication:** Setup Supabase Auth with Next.js App Router (Middleware for route protection).

## Phase 2: User Onboarding & Dashboard
1. **Auth Pages:** Build `/sign-in` and `/sign-up` pages.
2. **Onboarding Flow:** Build `/onboarding` to collect user skill level, goal, and preferred language. Save to `profiles` table.
3. **Dashboard UI:** Build `/dashboard` layout.
4. **Progress Components:** Implement XP, Streak, and Level indicators in the dashboard.
5. **Mission List:** Fetch and display available React Hospital missions from `bug_cases` and `modules`.

## Phase 3: The React Hospital Coding Environment
1. **Editor Layout:** Build the split-pane layout for `/hospital/case/[id]`.
2. **Monaco Editor Integration:** Install `@monaco-editor/react`, configure dark theme, and wire up state to capture user code.
3. **Preview/Terminal Mock:** Create static or mock representations of the expected output and error logs based on the case data.

## Phase 4: AI Tutor & Submission System
1. **AI Setup:** Install Vercel AI SDK and configure the OpenAI/Gemini provider.
2. **Chat Interface:** Build the AI Mentor chat UI within the left panel.
3. **Chat API Route:** Implement `/api/chat` enforcing the AI-TUTOR-SPEC (no direct answers, use current code context).
4. **Code Submission Logic:** Create server action `submitCode`.
5. **AI Code Reviewer:** Build the prompt to evaluate submitted code against `expected_code` and return JSON (is_passed, score, feedback).
6. **Results UI:** Show a success/failure dialog, award XP, update streaks, and return user to the dashboard.

## Phase 5: Admin Tools & Data Seeding
1. **Admin Layout:** Build `/admin` protected by an admin role/flag.
2. **Case Creator:** Form to insert new `bug_cases` (Broken code, Expected code, Hints).
3. **Seed Data:** Add 3-5 initial cases (e.g., Hydration Error, Infinite Loop, State Mutation) to test the platform immediately.

## Development Rules for Step-by-Step Execution
- We will complete one phase fully before moving to the next.
- QA Checklist must be passed at the end of each phase.
- All code must adhere to `DESIGN-SYSTEM.md` and `SPEC.md`.

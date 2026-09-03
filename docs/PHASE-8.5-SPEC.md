# Phase 8.5 Specification — Engagement, AI Mentor Hint System, and Student Experience Polish

## Overview
Phase 8.5 refactors React Hospital's student-facing user experience from a dry dashboard into an engaging, gamified mission-based coding hospital led by **Dr. React** (Senior Debugging Mentor).

## Completed Objectives

### 1. AI Mentor & Evaluator System
- Separated AI Mentor from AI Evaluator:
  - `src/lib/ai/mentorPrompt.ts`: Creates Dr. React mentor prompt supporting Hinglish/English, mentor styles (friendly, direct, interview), and 4 progressive hint stages.
  - `src/lib/ai/evaluatorPrompt.ts`: Evaluation prompt for post-submission scoring.
  - `src/app/api/mentor/route.ts`: Dedicated endpoint for Dr. React with fallback offline guidance.

### 2. Gamified Mission Hub & Patient File Case Page
- Transformed `/dashboard` into **React Hospital Emergency Ward**:
  - Medical terminology: "Emergency Cases Waiting", "Patient Survival Streak", "Code Green/Yellow/Red Emergency Level", "Start Treatment".
  - Weak Concept Alert banner.
- Redesigned mission editor layout (`/hospital/case/id` & `/hospital/case/[id]`):
  - Top Patient Profile header.
  - Left Panel: Patient Chart (Symptoms, Vital Signs) + **Dr. React AI Mentor Tab**.
  - Quick Diagnostic Action Chips ("💡 Small Hint", "🔍 Explain Error", "🎯 What to Check", "🆘 Line Clue").
  - Post-submission Feedback Modal: "🎉 Patient Stabilized!" / "⚠️ Patient Condition Critical".

### 3. Student Preferences & Mobile Polish
- Updated `/onboarding` & `/dashboard/settings` to capture:
  - Coding Confidence
  - Dr. React Language (Hinglish / English)
  - Mentor Style (Friendly / Direct / Interview Mode)
  - Hint Strictness (Gentle / Balanced / Challenge)
- Updated mobile app with Dr. React Daily Diagnostic Tip and "Diagnosis Drill".

---

## Verification Results
- Web Lint: `npm run lint` (PASSED)
- Web Production Build: `npm run build` (PASSED)
- Mobile Lint: `npm run lint` (PASSED)
- Mobile Typecheck: `npm run typecheck` (PASSED)

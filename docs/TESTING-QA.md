# Testing & QA Specifications

## 1. QA Philosophy
Every feature must be tested before being marked as done. Since we are building an educational platform, broken code in the platform itself will ruin trust.

## 2. Test Pyramid
- **Unit Tests (Jest/Vitest):**
  - Core utility functions (e.g., XP calculation, level progression).
  - Validation logic.
- **Component Tests (React Testing Library):**
  - Complex UI components (e.g., Editor layout, Chat UI rendering).
- **E2E Tests (Playwright / Cypress):**
  - Critical paths: Auth flow, Onboarding, Submitting a code fix, Admin creating a case.

## 3. QA Checklist for Every Feature
- [ ] Meets Acceptance Criteria defined in specs.
- [ ] Mobile responsive (tested on standard mobile breakpoints).
- [ ] Dark mode UI colors are consistent with Design System.
- [ ] No console errors or warnings.
- [ ] AI prompts fall back gracefully if the API rate limits or fails.
- [ ] Loading states (skeletons/spinners) are implemented.
- [ ] Error states (toast notifications) are implemented.

## 4. Specific Platform Risks to Test
- **Monaco Editor:** Ensure it loads correctly and doesn't memory leak on unmount.
- **AI Streaming:** Ensure the chat UI handles streaming chunks smoothly without breaking markdown formatting.
- **State Integrity:** Ensure XP and Streaks update correctly without race conditions.

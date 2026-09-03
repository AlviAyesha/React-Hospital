# AI Cost Controls & Safety Architecture

## Overview

React Hospital uses Google Gemini 2.0 Flash (`google('gemini-2.0-flash')`) for Dr. React mentoring and submission evaluation. To prevent excessive API usage, denial-of-service, and token inflation attacks, strict cost controls are enforced at both application and API route levels.

---

## 1. Rate & Usage Limits

### Free Plan Users
- **AI Tutor Cap**: Maximum **5 AI Mentor messages** per mission.
- **Enforcement**: Checked client-side and server-side in `src/lib/accessControl.ts` (`canUseAITutor()`).
- **UI Action**: Displays Pro upgrade banner when cap is reached.

### Pro Survivor & Admin Users
- **AI Tutor Cap**: Unlimited access per mission.
- **Fair Use Guardrail**: 30-second duration timeout (`export const maxDuration = 30;`) on streaming routes.

---

## 2. Input Size Hard Caps

To prevent token injection and large file payload abuse, server API routes (`/api/mentor` and `/api/chat`) enforce input truncations before building Gemini prompt payloads:

```ts
const MAX_CODE_LENGTH = 10000;  // Max 10,000 characters (~2,500 tokens)
const MAX_PROMPT_LENGTH = 1000; // Max 1,000 characters (~250 tokens)

const safeCode = (currentCode || '').slice(0, MAX_CODE_LENGTH);
const safeQuestion = (question || '').slice(0, MAX_PROMPT_LENGTH);
```

---

## 3. Fallback Offline Guidance

If the Gemini API key is unconfigured, rate-limited, or unavailable:
- The `/api/mentor` route catches the error gracefully and returns pre-formatted offline Dr. React diagnostic hints matching the requested hint stage (Hint 1 to 4).
- Prevents application downtime and eliminates unexpected API retry loops.

---

## 4. Cost Projection (Gemini 2.0 Flash)

| Usage Level | Estimated API Cost / Month |
|-------------|----------------------------|
| 1,000 Active Free Users | ~$1.50 / month |
| 10,000 Active Free Users | ~$15.00 / month |
| 500 Pro Subscribers | ~$12.50 / month |

*Note: Gemini 2.0 Flash input pricing is $0.10 / 1M tokens, making it cost-efficient for interactive code mentoring.*

# API Contracts (Server Actions & Endpoints)

In Next.js App Router, we prioritize **Server Actions** over traditional API Routes for internal mutations.

## 1. User & Profile
- `updateUserProfile(data: ProfileUpdateInput): Promise<Profile>`
  - Updates skill level, goals, language preference during onboarding.

## 2. Learning & Missions
- `getLearningPath(userId: string): Promise<Module[]>`
  - Returns the personalized learning path and unlocked modules.
- `getBugCase(caseId: string): Promise<BugCase>`
  - Fetches details of a specific React Hospital mission.

## 3. Submissions & Code Execution
- `submitCode(caseId: string, code: string): Promise<SubmissionResult>`
  - Validates code structure/syntax.
  - Generates AI evaluation.
  - Returns pass/fail status, AI feedback, and awarded XP.

## 4. AI Tutor Chat
- `POST /api/chat` (Standard Next.js Route for streaming)
  - Inputs: `messages[]`, `context` (current code, errors).
  - Outputs: Streaming text response from AI.
  - Rules enforced: Never give direct answers, use guiding questions, adapt to language preference.

## 5. Admin Actions
- `createBugCase(data: BugCaseInput): Promise<BugCase>`
- `updatePromptTemplate(id: string, prompt: string): Promise<void>`

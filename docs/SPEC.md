# Technical Specification (SPEC)

## 1. Tech Stack Overview
### Web App
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Auth:** Supabase Auth
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel
- **Code Editor:** Monaco Editor
- **AI Integration:** OpenAI/Gemini SDK

### Mobile App (Later Phase)
- React Native + Expo
- NativeWind
- Supabase Auth

## 2. Architecture Guidelines
- **Modularity:** Separate business logic from UI components.
- **Server vs Client:** Maximize Server Components for performance; use Client Components only for interactivity (e.g., Monaco Editor, Chat).
- **Data Access:** Data fetching via Next.js Server Components and Server Actions. Avoid direct API routes unless necessary for webhooks/external access.
- **Type Safety:** Strict TypeScript everywhere. Share types between DB (Supabase Gen) and frontend.

## 3. Recommended Folder Structure (Web)
```
/src
  /app           # Next.js App Router (Pages, Layouts, API routes)
  /components    # Reusable UI components (shadcn, custom)
  /features      # Domain-specific logic (e.g., /features/editor, /features/ai-tutor)
  /lib           # Utility functions, Supabase client, AI SDK setup
  /types         # Global TypeScript definitions
  /styles        # Global CSS
```

## 4. Development Rules
- No hardcoded business logic.
- Every feature must have acceptance criteria.
- Every page must be mobile responsive (except the complex coding environment which requires desktop-first).
- Every AI prompt must be stored in a separate prompt file (e.g., `src/lib/prompts/tutor.ts`).

## 5. Acceptance Criteria Standard
- **Given** [context]
- **When** [action]
- **Then** [expected result]

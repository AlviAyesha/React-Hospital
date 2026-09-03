# Web App Specifications

## 1. Overview
The web application is the primary coding environment for "React Hospital". It features a rich interface for code editing, real-time AI mentoring, and progress tracking.

## 2. Core Pages / Routes
- `/` - Landing page (Marketing)
- `/sign-in`, `/sign-up` - Auth pages
- `/onboarding` - Questionnaire for new users (Skill, Goal, Language)
- `/dashboard` - Main hub showing XP, Streak, current Level, and available Missions.
- `/hospital/case/[id]` - The core coding interface.

## 3. The Coding Interface (`/hospital/case/[id]`)
### Layout
- **Header:** Mission Title, Difficulty, "Submit" button, "Back to Dashboard" button.
- **Left Panel (Tabs):**
  - **Briefing:** User complaint, expected outcome.
  - **Terminal:** Simulated error logs / server errors.
  - **AI Mentor:** Chat interface for guidance.
- **Right Panel (Tabs):**
  - **Code Editor:** Monaco Editor initialized with `broken_code`.
  - **Preview:** Mock rendering of the output (in MVP, this can be static or a simple iframe/div depending on the bug type, as full live compilation is out of MVP scope).

## 4. State Management
- **Local State:** React `useState` / `useReducer` for editor tabs and UI toggles.
- **Global Data:** React Query (or simply Next.js Server Components + cache) for fetching user profile, missions, and submissions.
- **Zustand (Optional):** If cross-component state becomes complex (e.g., managing the active file in Monaco).

## 5. Implementation Details
- **Editor:** Use `@monaco-editor/react`. Configure for TypeScript/React.
- **Syntax Highlighting:** Ensure dark theme (e.g., `vs-dark`) matches the Design System.

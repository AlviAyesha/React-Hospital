# Mobile User Flows

## Flow 1: Authentication
1. User opens app -> Welcome Screen.
2. User taps "Sign In" -> Supabase Magic Link or OAuth.
3. If new user -> Redirect to Onboarding (Web is better for this, but mobile must handle basic fallback).
4. If returning user -> Redirect to Student Home.

## Flow 2: Daily Habit Loop
1. User receives Push Notification ("Maintain your streak!").
2. User taps notification -> Opens Student Home.
3. User taps "Start Daily Lesson".
4. App shows 3-5 swipeable flashcards (Theory: e.g., "What is useEffect?").
5. App shows 1 Code Reading Challenge (e.g., "Find the bug in this snippet", A/B/C options).
6. User selects correct answer -> Earns XP.
7. Success Screen -> Confirms Streak increment -> Returns to Home.

## Flow 3: AI Tutor Quick Chat
1. User taps "Tutor" tab.
2. User selects a topic or types a generic question ("Why does my state update one render late?").
3. AI Tutor responds conversationally using the same CTO Persona as the web.
4. Conversation is saved to history.

## Flow 4: Revision (Weak Areas)
1. User taps "Profile" or "Stats" tab.
2. User views "Skill Memory" highlighting weak concepts.
3. User taps "Revise Hydration Errors".
4. App generates a specific flashcard set based on that concept.

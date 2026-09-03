# Mobile Screen Map

## 1. Authentication Stack
- `/welcome` - Landing screen with logo and value prop.
- `/auth/login` - Email/Password or OAuth login form.

## 2. Main Tab Navigator (Bottom Tabs)
- `/ (Home)`
  - Displays current Streak, XP, Rank.
  - "Start Daily Lesson" CTA button.
  - Recent activity feed.
- `/tutor`
  - Chat interface with the AI Mentor.
  - Quick action chips ("Explain useEffect", "Help with bugs").
- `/stats`
  - Detailed XP breakdown.
  - Skill Memory radar chart (Weak vs Strong areas).
- `/profile`
  - Settings, Theme toggle, Logout.

## 3. Lesson Stack (Modal or Stack overlay)
- `/lesson/[id]`
  - Flashcard view (Swipe left/right).
- `/challenge/[id]`
  - Code reading view.
  - Displays a code block.
  - 3-4 selectable options for "What is the bug?".
  - "Submit" button.
- `/lesson/success`
  - Celebration animation (Lottie).
  - XP awarded display.
  - "Continue" button returning to Home.

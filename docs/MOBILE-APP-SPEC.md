# Mobile App Specifications

## 1. Product Vision
The React Hospital Mobile Companion App is designed to complement the heavy coding done on the Web App. It acts as a daily habit-building tool similar to Duolingo or Brilliant, focusing on micro-lessons, code reading, and spaced repetition.

## 2. Core Constraints
- **NO Heavy Coding:** No Monaco editor or typing out full React components on a mobile keyboard.
- **NO Admin Features:** Admin tasks are strictly web-based.
- **Focus:** Code reading, flashcards, concept revision, and maintaining streaks.

## 3. Tech Stack
- **Framework:** React Native + Expo
- **Routing:** Expo Router (file-based routing)
- **Language:** TypeScript
- **Styling:** NativeWind (Tailwind CSS for React Native)
- **Auth & Database:** Supabase React Native Client (Shared with web)
- **State Management:** Zustand (for local UI state if needed)

## 4. Architecture & Monorepo Strategy
Currently, the mobile app resides in `/mobile`. In the future, the repository will migrate to an `/apps` and `/packages` structure where `/packages/shared` will hold shared types, Zod schemas, and Supabase helpers.

## 5. UI/UX Guidelines
- **Theme:** Dark mode by default (Cyberpunk-lite vibe).
- **Interactions:** Fast, swipeable Tinder-style cards for code reading.
- **Navigation:** Bottom Tab Navigation for core areas.

## 6. Target MVP Features
1. Welcome / Login
2. Student Home (Dashboard summary, Streak)
3. Daily Lesson (Bite-sized theory)
4. Code Reading Challenge (Multiple choice identifying the bug)
5. AI Tutor Chat (For quick questions away from keyboard)
6. Progress / XP tracker

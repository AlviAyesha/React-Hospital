# Mobile QA Checklist

## 1. Environment & Build
- [ ] App initializes via `npx expo start` without errors.
- [ ] TypeScript compiles successfully without `any` abuse.
- [ ] NativeWind styling compiles correctly on both iOS and Android simulators.

## 2. UI & Responsiveness
- [ ] All screens follow the dark-mode standard.
- [ ] Layouts do not break on small screens (e.g., iPhone SE equivalent).
- [ ] Safe Area Providers are implemented (no content hidden behind notches or home indicators).
- [ ] Bottom Tab navigation icons and active states render correctly.

## 3. Functionality
- [ ] **Auth:** Login screen handles mock credentials.
- [ ] **Home:** Dashboard renders mock XP, Streak, and Rank correctly.
- [ ] **Lessons:** Swiping mechanism or "Next" button functions without stutter.
- [ ] **Challenges:** Code block text is legible, and selecting an option updates state.
- [ ] **AI Tutor:** Chat UI auto-scrolls to the bottom on new messages.
- [ ] **Progress:** XP, streak, and recent achievements are displayed accurately.
- [ ] **Weak Areas:** Constructive feedback points are presented to the user.
## 4. Performance
- [ ] No infinite re-renders on the Home dashboard.
- [ ] Flashcards render smoothly (consider using FlatList or optimized Swiper).

# Mobile App Production & Release Notes

## Overview

The React Hospital Mobile app (`mobile/`) is a React Native & Expo companion app designed for micro-lessons, flashcards, streak tracking, and code reading challenges ("Diagnosis Drill").

---

## 1. Expo Local Run & Build Instructions

```bash
# Navigate to mobile directory
cd mobile

# Install dependencies
npm install

# Run Expo development server
npx expo start

# Run iOS simulator (macOS only)
npx expo start --ios

# Run Android emulator
npx expo start --android
```

---

## 2. Store Deployment Strategy

> [!IMPORTANT]
> **Store Release Status**: Do NOT submit mobile app to Apple App Store or Google Play Store in Phase 9.

- **Reason**: Mobile in-app purchases (IAP) and full mobile code execution IDE are planned for future phases.
- Current mobile app acts as a zero-friction companion app with simulated local storage fallback and links to Web pricing (`http://localhost:3000/pricing` / web domain).

---

## 3. Mock & Fallback Behavior

- Mobile profile displays plan status (`Free Starter` vs `⭐ Pro Plan`).
- Web upgrade button opens web browser (`Linking.openURL()`).
- XP, daily streak, and flashcards use local Expo state.

---

## 4. Mobile QA & Typecheck Status

- `cd mobile && npm run lint`: **PASSED** (0 errors)
- `cd mobile && npm run typecheck`: **PASSED** (0 errors)

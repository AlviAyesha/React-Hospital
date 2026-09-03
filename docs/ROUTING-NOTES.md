# React Hospital Mobile Routing Notes

Due to strict Windows filesystem and code editor constraints, this Expo Router project utilizes standard static directories instead of dynamic or grouped path structures (i.e. no `[id]` or `(tabs)` folders).

## Folder Structure Mapping
- **`(tabs)`** -> renamed to **`tabs/`**
- **`[id].tsx`** -> renamed to **`id.tsx`**

## Current Routes
1. `/login` -> **`app/login.tsx`**
2. `/tabs` -> **`app/tabs/_layout.tsx`**
   - `/tabs/index` -> **`app/tabs/index.tsx`** (Student Home)
   - `/tabs/tutor` -> **`app/tabs/tutor.tsx`** (AI Tutor Chat)
   - `/tabs/profile` -> **`app/tabs/profile.tsx`** (Profile & Settings)
3. `/lesson/id` -> **`app/lesson/id.tsx`** (Daily Micro-Lesson)
4. `/challenge/id` -> **`app/challenge/id.tsx`** (Code Reading Challenge)
5. `/progress` -> **`app/progress.tsx`** (XP/Streak Progress)
6. `/weak-areas` -> **`app/weak-areas.tsx`** (Weak Areas Feedback)

## Future Considerations
If the application needs to handle dynamic identifiers (e.g. `lesson/123`), the standard Expo approach of `lesson/[id].tsx` is blocked. Instead, developers should:
1. Map generic static routes (like `/lesson/id`) to components that read query parameters (e.g. `router.push({ pathname: '/lesson/id', params: { lessonId: 123 } })`).
2. Manage state manually within the screen based on standard Context or Route params passed in without relying strictly on the filename.

*Note: This structure avoids Windows path resolution issues while keeping Expo Router functional for a basic MVP.*

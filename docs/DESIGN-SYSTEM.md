# Design System

## Philosophy
- **Vibe:** Cyberpunk-lite, clean dark mode, "hacker/developer" feel, highly professional but game-like.
- **Colors:** Deep dark backgrounds with vibrant neon accents (cyan, purple, green for success, red for errors).

## Typography
- **Primary:** Inter (clean, readable for UI).
- **Monospace:** Fira Code or JetBrains Mono (for code snippets and Monaco editor).

## Colors (Tailwind Tokens)
- `background`: `#09090b` (zinc-950)
- `surface`: `#18181b` (zinc-900)
- `primary`: `#3b82f6` (blue-500)
- `accent-success`: `#10b981` (emerald-500) - For passed tests
- `accent-error`: `#ef4444` (red-500) - For bugs/failed tests
- `text-main`: `#f4f4f5` (zinc-100)
- `text-muted`: `#a1a1aa` (zinc-400)

## Component Library (shadcn/ui)
- Buttons (Solid, Outline, Ghost)
- Cards (for Missions and Modules)
- Dialog / Modals (for hints and success popups)
- Progress Bars (for XP and Level progression)
- Toasts (for notifications and streaks)

## Layouts
- **Dashboard:** Sidebar navigation, main content area with grid of available missions.
- **Editor:** Split pane. Left side: Instructions, Error Logs, AI Tutor Chat. Right side: Monaco Code Editor, Preview tab.

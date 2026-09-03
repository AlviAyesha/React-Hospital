# Environment Setup Guide

## Environment Variables Configuration

Copy `.env.example` to `.env.local` for local web development, and `mobile/.env.example` for Expo mobile development.

### Web Environment (`.env.local`)

```env
# 1. Supabase Public Credentials (Required for Live Supabase Integration)
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here

# 2. Supabase Admin Credentials (Optional - Server-Only)
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here

# 3. Google AI Studio API Key (Required for AI mentor chat & live code evaluation)
GOOGLE_GENERATIVE_AI_API_KEY=your-google-generative-ai-key-here
```

### Mobile Environment (`mobile/.env`)

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

## Running without Supabase Secrets (Offline / Local Fallback Mode)

If `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are not set or contain placeholder strings:
- The app will automatically initialize in **Local Fallback Mode**.
- Auth state will be persisted to `localStorage`.
- Bug cases, submissions, XP, streaks, and skill memory will function locally using seed data and `localStorage`.
- Admin pages can be tested using the Dev Role Toggle.

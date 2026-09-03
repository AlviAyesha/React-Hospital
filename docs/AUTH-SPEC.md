# Authentication Specification & Architecture

## System Architecture

React Hospital uses a dual-mode authentication abstraction managed by `src/lib/authContext.tsx`.

```
                +---------------------------------+
                |          useAuth() Hook         |
                +---------------------------------+
                                 |
              Is Supabase Environment Configured?
                                 |
                 +---------------+---------------+
                 |                               |
             [ YES ]                          [ NO ]
                 |                               |
    +------------------------+      +-------------------------+
    | Supabase Auth Client   |      | Local Storage Auth      |
    | - supabase.auth        |      | - rh_local_user_profile |
    | - public.profiles      |      | - mock admin toggle     |
    +------------------------+      +-------------------------+
```

## User Profile Schema

Profiles map to `public.profiles` in Supabase:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `id` | `UUID / string` | Primary Key | User unique ID (matches Supabase `auth.users.id`) |
| `display_name` | `string` | `'Dev'` | Student display handle |
| `email` | `string` | `undefined` | User email address |
| `role` | `'student' \| 'admin'` | `'student'` | Access role for protected administration pages |
| `skill_level` | `'beginner' \| 'intermediate' \| 'advanced'` | `'intermediate'` | AI tutor calibration level |
| `goal` | `string` | `'job'` | Primary student learning goal |
| `preferred_language` | `string` | `'english'` | AI mentor communication language |
| `total_xp` | `number` | `0` | Cumulative gamification experience points |
| `current_level` | `number` | `1` | Gamification rank level |
| `current_streak` | `number` | `1` | Consecutive daily practice streak |
| `created_at` | `string` | `ISO Timestamp` | Registration timestamp |

## Protected Routes & Guards

### Web Admin Protection
- Route path: `/admin` and sub-routes (`/admin/cases`, `/admin/cases/new`).
- Protection mechanism: `AdminGuard` (`src/components/AdminGuard.tsx`).
- Rule: Inspects `useAuth()`. If `!user` or `user.role !== 'admin'`, renders an access denied banner preventing viewing or mutating administrative functions.

### Local Fallback Mode & Developer Override
- In local development without Supabase keys, users can toggle their mock role to `'admin'` using the `⚡ Dev Override` button on the access denied page or by logging in with an email containing `admin`.

## Mobile Auth Integration Plan
- Mobile app (`mobile/`) utilizes `mobile/lib/supabase.ts` for future mobile session sharing.
- Mobile auth currently operates on mock user state with zero breaking changes toExpo build or navigation.

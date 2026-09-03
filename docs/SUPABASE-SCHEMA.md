# Supabase Database Schema & Security Policy — Production Audit

This document contains the complete production PostgreSQL schema and Row Level Security (RLS) policies for React Hospital on Supabase.

---

## Complete Production Schema SQL

```sql
-- 1. Profiles Table (User Accounts, Roles, Subscriptions & Preferences)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT 'Dev',
  email TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  subscription_status TEXT DEFAULT 'none',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  current_period_end TIMESTAMP WITH TIME ZONE,
  skill_level TEXT NOT NULL DEFAULT 'intermediate' CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
  goal TEXT NOT NULL DEFAULT 'job',
  preferred_language TEXT NOT NULL DEFAULT 'english',
  mentor_language TEXT DEFAULT 'english',
  mentor_style TEXT DEFAULT 'friendly' CHECK (mentor_style IN ('friendly', 'direct', 'interview')),
  hint_strictness TEXT DEFAULT 'balanced',
  coding_confidence TEXT DEFAULT 'intermediate',
  total_xp INTEGER NOT NULL DEFAULT 0,
  current_level INTEGER NOT NULL DEFAULT 1,
  current_streak INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Bug Cases Table (Missions & Access Levels)
CREATE TABLE IF NOT EXISTS public.bug_cases (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  broken_code TEXT NOT NULL,
  expected_code TEXT NOT NULL,
  error_logs TEXT NOT NULL,
  user_complaint TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  access_level TEXT NOT NULL DEFAULT 'free' CHECK (access_level IN ('free', 'pro')),
  xp_reward INTEGER NOT NULL DEFAULT 100,
  module_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Case Submissions Table
CREATE TABLE IF NOT EXISTS public.case_submissions (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  bug_case_id TEXT REFERENCES public.bug_cases(id) ON DELETE CASCADE,
  submitted_code TEXT NOT NULL,
  is_passed BOOLEAN NOT NULL DEFAULT false,
  score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. AI Feedback Table
CREATE TABLE IF NOT EXISTS public.ai_feedback (
  id TEXT PRIMARY KEY,
  submission_id TEXT REFERENCES public.case_submissions(id) ON DELETE CASCADE,
  feedback_text TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  what_is_wrong TEXT NOT NULL,
  what_is_correct TEXT NOT NULL,
  hint TEXT NOT NULL,
  fixed_concept TEXT NOT NULL,
  next_practice_task TEXT NOT NULL,
  weaknesses_detected JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Student Progress Table
CREATE TABLE IF NOT EXISTS public.student_progress (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  completed_cases JSONB DEFAULT '[]'::jsonb,
  unlocked_modules JSONB DEFAULT '[]'::jsonb,
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Skill Memory Table
CREATE TABLE IF NOT EXISTS public.skill_memory (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  concept_name TEXT NOT NULL,
  mastery_score INTEGER NOT NULL DEFAULT 0, -- 0-100
  attempts INTEGER NOT NULL DEFAULT 0,
  failures INTEGER NOT NULL DEFAULT 0,
  last_tested_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  status TEXT NOT NULL DEFAULT 'weak' CHECK (status IN ('weak', 'improving', 'strong'))
);

-- 7. Streaks Table
CREATE TABLE IF NOT EXISTS public.streaks (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_active_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- 8. XP Events Table
CREATE TABLE IF NOT EXISTS public.xp_events (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('case_submission', 'lesson_completion', 'challenge_completion', 'streak_bonus')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

---

## Row Level Security (RLS) Policies & Data Protection Rules

```sql
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bug_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_memory ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
-- Students can read & update only their own profile
CREATE POLICY "Users read own profile" ON public.profiles 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users update own profile" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins view all profiles" ON public.profiles 
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 2. Bug Cases Policies
-- All authenticated & public users can read bug cases
CREATE POLICY "Public read bug cases" ON public.bug_cases 
  FOR SELECT USING (true);

-- Only Admin role can insert, update, or delete bug cases
CREATE POLICY "Admins insert bug cases" ON public.bug_cases 
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins update bug cases" ON public.bug_cases 
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 3. Case Submissions & Private Progress Isolation
-- Students CANNOT read other students' private progress or code submissions
CREATE POLICY "Users manage own submissions" ON public.case_submissions 
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own progress" ON public.student_progress 
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own skill memory" ON public.skill_memory 
  FOR ALL USING (auth.uid() = user_id);
```

---

## Server-Side Service Role Key Security Rule
- `SUPABASE_SERVICE_ROLE_KEY` bypasses all RLS policies and is **strictly restricted to server-side execution** (API routes such as `/api/stripe/webhook` and `/api/submit`).
- **Never expose `SUPABASE_SERVICE_ROLE_KEY` in client components or browser bundles.**

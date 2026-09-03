import { Profile, BugCase } from './types';

export const FREE_AI_TUTOR_LIMIT = 5;

export function canAccessCase(user: Profile | null, bugCase: BugCase): boolean {
  if (!user) return bugCase.access_level !== 'pro';
  if (user.role === 'admin') return true;
  if (bugCase.access_level === 'pro') {
    return user.plan === 'pro';
  }
  return true;
}

export function canUseAITutor(user: Profile | null, currentUsageCount: number): boolean {
  if (!user) return currentUsageCount < FREE_AI_TUTOR_LIMIT;
  if (user.role === 'admin' || user.plan === 'pro') return true;
  return currentUsageCount < FREE_AI_TUTOR_LIMIT;
}

export function getPlanLimits(user: Profile | null) {
  const isPro = user?.plan === 'pro' || user?.role === 'admin';

  return {
    plan: isPro ? ('pro' as const) : ('free' as const),
    caseAccess: isPro ? 'All Cases (Free + Pro)' : 'Beginner / Free Cases Only',
    aiTutorLimit: isPro ? 'Unlimited AI Mentor Messages' : `${FREE_AI_TUTOR_LIMIT} Messages per Mission`,
    skillMemoryAccess: isPro ? 'Full Analytics & Mastery Breakdown' : 'Basic Skill Tracking',
    prioritySupport: isPro,
  };
}

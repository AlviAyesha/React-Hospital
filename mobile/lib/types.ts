export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Profile {
  id: string;
  display_name: string;
  skill_level: SkillLevel;
  goal: string;
  preferred_language: string;
  total_xp: number;
  current_level: number;
  current_streak: number;
  created_at: string;
}

export interface BugCase {
  id: string;
  title: string;
  description: string;
  broken_code: string;
  expected_code: string;
  error_logs: string;
  user_complaint: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  xp_reward: number;
  module_id?: string;
  created_at?: string;
}

export interface CaseSubmission {
  id: string;
  user_id: string;
  bug_case_id: string;
  submitted_code: string;
  is_passed: boolean;
  score: number;
  created_at: string;
}

export interface AiFeedback {
  id: string;
  submission_id: string;
  feedback_text: string;
  score: number;
  what_is_wrong: string;
  what_is_correct: string;
  hint: string;
  fixed_concept: string;
  next_practice_task: string;
  weaknesses_detected: string[]; 
  created_at: string;
}

export interface StudentProgress {
  user_id: string;
  completed_cases: string[]; 
  unlocked_modules: string[];
  last_activity_at: string;
}

export interface SkillMemory {
  user_id: string;
  concept_name: string;
  mastery_score: number; 
  attempts: number;
  failures: number;
  last_tested_at: string;
  status: 'weak' | 'improving' | 'strong';
}

export interface Streak {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_active_date: string;
}

export interface XPEvent {
  id: string;
  user_id: string;
  amount: number;
  source: 'case_submission' | 'lesson_completion' | 'challenge_completion' | 'streak_bonus';
  created_at: string;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  difficulty: SkillLevel;
  xp_reward: number;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  completed_at: string;
}

export interface CodeChallenge {
  id: string;
  title: string;
  code_snippet: string;
  options: string[];
  correct_option_index: number;
  explanation: string;
  xp_reward: number;
}

export interface ChallengeAttempt {
  id: string;
  user_id: string;
  challenge_id: string;
  selected_option: number;
  is_correct: boolean;
  created_at: string;
}

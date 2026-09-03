import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { isSupabaseConfigured } from './client';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export function getSupabaseServerClient(): SupabaseClient | null {
  if (typeof window !== 'undefined') {
    console.error('getSupabaseServerClient called in client context');
  }
  if (!isSupabaseConfigured()) {
    return null;
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

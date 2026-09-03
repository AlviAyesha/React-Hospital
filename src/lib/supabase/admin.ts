import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export function isSupabaseAdminConfigured(): boolean {
  if (typeof window !== 'undefined') return false; // Never configured on client
  return (
    Boolean(supabaseUrl) &&
    Boolean(serviceRoleKey) &&
    !supabaseUrl.includes('your-supabase-project') &&
    !serviceRoleKey.includes('your-supabase-service-role-key') &&
    (supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://'))
  );
}

let adminInstance: SupabaseClient | null = null;

export function getSupabaseAdminClient(): SupabaseClient | null {
  if (typeof window !== 'undefined') {
    console.error('getSupabaseAdminClient must NEVER be called on the client side');
    return null;
  }
  if (!isSupabaseAdminConfigured()) {
    return null;
  }
  if (!adminInstance) {
    adminInstance = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return adminInstance;
}

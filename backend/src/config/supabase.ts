import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';

/**
 * Supabase Admin Client using the Service Role Key.
 * Grants backend access to bypass RLS for administrative triggers, AI ingestion,
 * and background WhatsApp worker jobs.
 */
export const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

/**
 * Creates a user-scoped Supabase client that honors Row Level Security (RLS)
 * using the bearer token from the incoming HTTP request.
 */
export function createScopedClient(accessToken: string) {
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      persistSession: false,
    },
  });
}


import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Cookie-free client for public (visitor) reads and contact-form inserts.
 * Returns null when Supabase env vars aren't set, so the site still renders
 * (with default text) before the database is connected.
 */
export function createPublicClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      // Cache reads for at most 60s (admin saves also purge the cache immediately).
      fetch: (input, init) =>
        !init?.method || init.method === 'GET'
          ? fetch(input, { ...init, next: { revalidate: 60 } })
          : fetch(input, init),
    },
  });
}

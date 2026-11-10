import { createBrowserClient } from '@supabase/ssr';

/** Browser client — used by the admin dashboard (carries the admin's session). */
export function createBrowserSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

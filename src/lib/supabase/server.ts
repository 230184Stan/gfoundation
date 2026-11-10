import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/** Server client that reads the signed-in admin's session from cookies. */
export function createServerSupabase() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(toSet) {
          try {
            toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Called from a Server Component — the middleware refreshes sessions instead.
          }
        },
      },
    },
  );
}

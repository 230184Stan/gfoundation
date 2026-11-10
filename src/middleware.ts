import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/** Keeps the admin session fresh and sends signed-out visitors to /admin/login. */
export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isLogin = request.nextUrl.pathname === '/admin/login';

  if (!url || !key) {
    // Supabase not configured yet: only the login page (which explains this) is reachable.
    return isLogin ? NextResponse.next() : NextResponse.redirect(new URL('/admin/login', request.url));
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(toSet) {
        toSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        toSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();

  if (!user && !isLogin) return NextResponse.redirect(new URL('/admin/login', request.url));
  if (user && isLogin) return NextResponse.redirect(new URL('/admin', request.url));
  return response;
}

export const config = { matcher: ['/admin/:path*'] };

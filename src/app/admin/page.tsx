import type { Metadata } from 'next';
import { createServerSupabase } from '@/lib/supabase/server';
import AdminApp from '@/components/admin/AdminApp';
import SignOutButton from '@/components/admin/SignOutButton';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Admin', robots: { index: false, follow: false } };

export default async function AdminPage() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  // The middleware already redirects signed-out visitors; this guards the rest.
  const { data: adminRow } = user
    ? await supabase.from('admins').select('user_id').eq('user_id', user.id).maybeSingle()
    : { data: null };

  if (!user || !adminRow) {
    return (
      <main className="login-wrap">
        <div className="login-card">
          <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--green-dark)', marginBottom: '0.75rem' }}>
            No admin access
          </h1>
          <p style={{ marginBottom: '1.25rem' }}>
            {user?.email ?? 'This account'} is signed in but is not on the admin list. Ask an existing
            admin to add you (see the README).
          </p>
          <SignOutButton />
        </div>
      </main>
    );
  }

  return <AdminApp email={user.email ?? ''} />;
}

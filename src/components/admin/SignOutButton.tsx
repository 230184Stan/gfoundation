'use client';

import { useRouter } from 'next/navigation';
import { createBrowserSupabase } from '@/lib/supabase/client';

export default function SignOutButton({ className = 'btn btn-primary small' }: { className?: string }) {
  const router = useRouter();
  return (
    <button
      className={className}
      onClick={async () => {
        await createBrowserSupabase().auth.signOut();
        router.replace('/admin/login');
        router.refresh();
      }}
    >
      Sign out
    </button>
  );
}

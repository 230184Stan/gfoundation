'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabase } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const { error } = await createBrowserSupabase().auth.signInWithPassword({ email, password });
    if (error) {
      setError('Incorrect email or password.');
      setBusy(false);
      return;
    }
    router.replace('/admin');
    router.refresh();
  }

  return (
    <main className="login-wrap">
      <div className="login-card">
        <div className="login-brand">
          <img src="/assets/logo.png" alt="Gamuna Foundation logo" />
          <div>
            <p className="eyebrow">Admin Portal</p>
            <h1>Gamuna Foundation</h1>
          </div>
        </div>

        {!configured && (
          <div className="notice error">
            Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
            to your environment (see README).
          </div>
        )}

        <form className="login-form field" onSubmit={onSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" required autoComplete="username" value={email}
              onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input id="password" type="password" required autoComplete="current-password" value={password}
              onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <div className="notice error" role="alert">{error}</div>}
          <button type="submit" className="btn btn-primary" disabled={busy || !configured}>
            {busy ? 'Signing in…' : 'Log In'}
          </button>
        </form>
      </div>
    </main>
  );
}

'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import ResourceManager from './ResourceManager';
import SettingsEditor from './SettingsEditor';
import MessagesManager from './MessagesManager';
import SignOutButton from './SignOutButton';
import { RESOURCES } from './config';
import { createBrowserSupabase } from '@/lib/supabase/client';

type TabId = 'settings' | 'pillars' | 'programs' | 'events' | 'news' | 'team' | 'messages';

const TABS: { id: TabId; label: string }[] = [
  { id: 'settings', label: 'Site text' },
  { id: 'pillars', label: 'Home cards' },
  { id: 'programs', label: 'Programs' },
  { id: 'events', label: 'Events' },
  { id: 'news', label: 'News' },
  { id: 'team', label: 'Team' },
  { id: 'messages', label: 'Messages' },
];

export default function AdminApp({ email }: { email: string }) {
  const [tab, setTab] = useState<TabId>('settings');
  const [unread, setUnread] = useState(0);
  const onUnread = useCallback((n: number) => setUnread(n), []);

  useEffect(() => {
    void createBrowserSupabase()
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .eq('is_read', false)
      .then(({ count }) => setUnread(count ?? 0));
  }, []);

  return (
    <div className="admin-shell">
      <header className="admin-top">
        <div className="admin-top-inner">
          <div className="admin-brand">
            <img src="/assets/logo.png" alt="" className="logo-img" />
            <div>
              Gamuna Foundation
              <small>Admin dashboard</small>
            </div>
          </div>
          <div className="admin-user">
            <Link href="/" target="_blank">View website ↗</Link>
            <span>{email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <nav className="admin-tabs" aria-label="Dashboard sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`admin-tab${tab === t.id ? ' active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
            {t.id === 'messages' && unread > 0 && <span className="count">{unread}</span>}
          </button>
        ))}
      </nav>

      <main className="admin-main">
        {tab === 'settings' && <SettingsEditor />}
        {tab === 'messages' && <MessagesManager onUnreadChange={onUnread} />}
        {tab !== 'settings' && tab !== 'messages' && <ResourceManager config={RESOURCES[tab]} />}
      </main>
    </div>
  );
}

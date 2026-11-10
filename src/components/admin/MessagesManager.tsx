'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createBrowserSupabase } from '@/lib/supabase/client';
import type { MessageRow } from '@/lib/types';

export default function MessagesManager({ onUnreadChange }: { onUnreadChange: (n: number) => void }) {
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const [rows, setRows] = useState<MessageRow[] | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('messages').select('*').order('created_at', { ascending: false });
    if (error) return setError(error.message);
    const list = (data ?? []) as MessageRow[];
    setRows(list);
    onUnreadChange(list.filter((m) => !m.is_read).length);
  }, [supabase, onUnreadChange]);

  useEffect(() => { void load(); }, [load]);

  async function toggleRead(m: MessageRow, is_read: boolean) {
    const { error } = await supabase.from('messages').update({ is_read }).eq('id', m.id);
    if (error) setError(error.message); else await load();
  }

  async function open(m: MessageRow) {
    setOpenId(openId === m.id ? null : m.id);
    if (!m.is_read) await toggleRead(m, true);
  }

  async function remove(m: MessageRow) {
    if (!window.confirm(`Delete the message from ${m.name}?`)) return;
    const { error } = await supabase.from('messages').delete().eq('id', m.id);
    if (error) setError(error.message); else await load();
  }

  return (
    <section className="admin-panel">
      <div className="admin-panel-head">
        <div>
          <h2>Messages</h2>
          <p className="hint">Sent from the contact form on the website.</p>
        </div>
      </div>
      {error && <div className="notice error" role="alert">{error}</div>}
      {rows === null ? (
        <p className="empty-state">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="empty-state">No messages yet.</p>
      ) : (
        <div className="record-list">
          {rows.map((m) => (
            <div key={m.id}>
              <div className={`record-item${m.is_read ? '' : ' unread'}`}>
                <div className="record-main">
                  <div>
                    <strong>
                      {m.name}
                      {m.subject && <span className="pill">{m.subject}</span>}
                    </strong>
                    <p>{new Date(m.created_at).toLocaleString('en-GB', { timeZone: 'Pacific/Port_Moresby' })} · {m.email}</p>
                  </div>
                </div>
                <div className="record-actions">
                  <button className="btn btn-ghost small" onClick={() => open(m)}>
                    {openId === m.id ? 'Hide' : 'Read'}
                  </button>
                  <button className="btn btn-danger small" onClick={() => remove(m)}>Delete</button>
                </div>
              </div>
              {openId === m.id && (
                <div className="record-item" style={{ display: 'block', borderTop: 'none' }}>
                  <p className="message-body">{m.message}</p>
                  <p style={{ padding: '0.5rem 1rem 0.75rem', fontSize: '0.88rem' }}>
                    <a href={`mailto:${m.email}?subject=${encodeURIComponent('Re: ' + (m.subject ?? 'Your message to Gamuna Foundation'))}`}>
                      Reply by email
                    </a>
                    {m.phone && <> · {m.phone}</>}
                    {m.is_read && (
                      <> · <button className="btn btn-ghost small" onClick={() => toggleRead(m, false)}>Mark unread</button></>
                    )}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

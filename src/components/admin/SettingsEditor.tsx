'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { createBrowserSupabase } from '@/lib/supabase/client';
import { revalidateSite } from '@/app/admin/actions';
import { DEFAULT_SETTINGS } from '@/lib/defaults';
import FieldInput, { type Value } from './FieldInput';
import { SETTINGS_GROUPS, type SettingsGroup } from './config';

type Stored = Record<string, Record<string, string>>;

function Group({ group, initial }: { group: SettingsGroup; initial: Record<string, string> }) {
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const { error } = await supabase
      .from('site_settings')
      .upsert({ key: group.key, value: values, updated_at: new Date().toISOString() });
    if (error) setMsg({ kind: 'error', text: error.message });
    else {
      await revalidateSite();
      setMsg({ kind: 'ok', text: 'Saved. The change is live on the website.' });
    }
    setBusy(false);
  }

  return (
    <div className="settings-group">
      <h3>{group.title}</h3>
      <form className="admin-form" onSubmit={onSave}>
        {group.fields.map((f) => (
          <FieldInput
            key={f.name}
            field={f}
            value={values[f.name] ?? ''}
            onChange={(name, v: Value) => setValues((p) => ({ ...p, [name]: String(v ?? '') }))}
          />
        ))}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary small" disabled={busy}>
            {busy ? 'Saving…' : 'Save'}
          </button>
          {msg && <span className={`notice ${msg.kind}`} style={{ margin: 0 }}>{msg.text}</span>}
        </div>
      </form>
    </div>
  );
}

export default function SettingsEditor() {
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const [stored, setStored] = useState<Stored | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    void (async () => {
      const { data, error } = await supabase.from('site_settings').select('key, value');
      if (error) return setError(error.message);
      const merged: Stored = {};
      for (const g of SETTINGS_GROUPS) {
        const defaults = DEFAULT_SETTINGS[g.key as keyof typeof DEFAULT_SETTINGS] as Record<string, string>;
        const row = data?.find((r) => r.key === g.key);
        merged[g.key] = { ...defaults, ...((row?.value as Record<string, string>) ?? {}) };
      }
      setStored(merged);
    })();
  }, [supabase]);

  return (
    <section className="admin-panel">
      <div className="admin-panel-head">
        <div>
          <h2>Site text</h2>
          <p className="hint">Contact details and the main wording on the Home, About and Programs pages.</p>
        </div>
      </div>
      {error && <div className="notice error" role="alert">{error}</div>}
      {!stored && !error && <p className="empty-state">Loading…</p>}
      {stored && SETTINGS_GROUPS.map((g) => <Group key={g.key} group={g} initial={stored[g.key]} />)}
    </section>
  );
}

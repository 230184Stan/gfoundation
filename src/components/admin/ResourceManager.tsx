'use client';

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { createBrowserSupabase } from '@/lib/supabase/client';
import { revalidateSite } from '@/app/admin/actions';
import FieldInput, { type Value } from './FieldInput';
import { NULLABLE_FIELDS, type ResourceConfig } from './config';

type Row = Record<string, unknown> & { id: string };
type Values = Record<string, Value>;

export default function ResourceManager({ config }: { config: ResourceConfig }) {
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const [rows, setRows] = useState<Row[] | null>(null);
  const [editingId, setEditingId] = useState<string | 'new' | null>(null);
  const [values, setValues] = useState<Values>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [flash, setFlash] = useState('');

  const load = useCallback(async () => {
    let q = supabase.from(config.table).select('*');
    for (const o of config.order) q = q.order(o.column, { ascending: o.ascending ?? true });
    const { data, error } = await q;
    if (error) setError(error.message);
    else setRows((data ?? []) as Row[]);
  }, [supabase, config]);

  useEffect(() => {
    setRows(null);
    setEditingId(null);
    setError('');
    void load();
  }, [load]);

  function startNew() {
    const v: Values = {};
    for (const f of config.fields) {
      if (f.type === 'checkbox') v[f.name] = true;
      else if (f.type === 'select') v[f.name] = f.options?.[0]?.value ?? '';
      else if (f.name === 'sort_order') {
        const max = Math.max(0, ...(rows ?? []).map((r) => Number(r.sort_order) || 0));
        v[f.name] = max + 10;
      } else if (f.type === 'date') v[f.name] = new Date().toISOString().slice(0, 10);
      else v[f.name] = '';
    }
    setValues(v);
    setEditingId('new');
    setFlash('');
    setError('');
  }

  function startEdit(row: Row) {
    const v: Values = {};
    for (const f of config.fields) v[f.name] = (row[f.name] as Value) ?? (f.type === 'checkbox' ? false : '');
    setValues(v);
    setEditingId(row.id);
    setFlash('');
    setError('');
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');

    const payload: Record<string, unknown> = {};
    for (const f of config.fields) {
      const raw = values[f.name];
      if (f.type === 'number') payload[f.name] = Number(raw) || 0;
      else if (f.type === 'checkbox') payload[f.name] = Boolean(raw);
      else {
        const s = typeof raw === 'string' ? raw.trim() : '';
        const nullable = NULLABLE_FIELDS.has(f.name) || f.type === 'image' || f.type === 'url';
        payload[f.name] = s === '' && nullable ? null : s;
      }
    }

    const { error } =
      editingId === 'new'
        ? await supabase.from(config.table).insert(payload)
        : await supabase.from(config.table).update(payload).eq('id', editingId!);

    if (error) {
      setError(error.message);
      setBusy(false);
      return;
    }
    await revalidateSite();
    await load();
    setEditingId(null);
    setBusy(false);
    setFlash('Saved. The change is live on the website.');
  }

  async function onDelete(row: Row) {
    const label = String(row[config.primary] ?? 'this item');
    if (!window.confirm(`Delete “${label}”? This cannot be undone.`)) return;
    const { error } = await supabase.from(config.table).delete().eq('id', row.id);
    if (error) return setError(error.message);
    await revalidateSite();
    await load();
    setFlash('Deleted.');
  }

  return (
    <section className="admin-panel">
      <div className="admin-panel-head">
        <div>
          <h2>{config.title}</h2>
          <p className="hint">{config.hint}</p>
        </div>
        {editingId === null && (
          <button className="btn btn-primary small" onClick={startNew}>+ {config.addLabel}</button>
        )}
      </div>

      {error && <div className="notice error" role="alert">{error}</div>}
      {flash && <div className="notice ok">{flash}</div>}

      {editingId !== null && (
        <form className="admin-form" onSubmit={onSave}>
          {config.fields.map((f) => (
            <FieldInput
              key={f.name}
              field={f}
              value={values[f.name] ?? ''}
              imageFolder={config.imageFolder}
              onChange={(name, v) => setValues((prev) => ({ ...prev, [name]: v }))}
            />
          ))}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary small" disabled={busy}>
              {busy ? 'Saving…' : editingId === 'new' ? 'Add' : 'Save changes'}
            </button>
            <button type="button" className="btn btn-ghost small" onClick={() => setEditingId(null)} disabled={busy}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {rows === null ? (
        <p className="empty-state">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="empty-state">Nothing here yet.</p>
      ) : (
        <div className="record-list">
          {rows.map((row) => (
            <div className="record-item" key={row.id}>
              <div className="record-main">
                {config.thumb && (
                  <img className="record-thumb" alt="" src={(row[config.thumb] as string) || '/assets/team/placeholder.png'} />
                )}
                <div>
                  <strong>
                    {String(row[config.primary] ?? '')}
                    {row.is_published === false && <span className="pill">Hidden</span>}
                  </strong>
                  {config.secondary && <p>{String(row[config.secondary] ?? '')}</p>}
                </div>
              </div>
              <div className="record-actions">
                <button className="btn btn-ghost small" onClick={() => startEdit(row)}>Edit</button>
                <button className="btn btn-danger small" onClick={() => onDelete(row)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

'use client';

import { useId, useState } from 'react';
import { createBrowserSupabase } from '@/lib/supabase/client';
import type { Field } from './config';

export type Value = string | number | boolean | null;

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function ImageInput({
  value, onChange, folder,
}: { value: string; onChange: (v: string) => void; folder: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function upload(file: File) {
    setError('');
    if (!file.type.startsWith('image/')) return setError('Please choose an image file.');
    if (file.size > MAX_IMAGE_BYTES) return setError('Image is larger than 5 MB.');
    setBusy(true);
    const supabase = createBrowserSupabase();
    const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
    const path = `${folder}/${Date.now()}-${safe}`;
    const { error: upErr } = await supabase.storage.from('media').upload(path, file, {
      contentType: file.type,
    });
    if (upErr) {
      setError(upErr.message);
    } else {
      onChange(supabase.storage.from('media').getPublicUrl(path).data.publicUrl);
    }
    setBusy(false);
  }

  return (
    <div>
      <div className="image-field">
        {value && <img src={value} alt="Preview" />}
        <input
          type="file"
          accept="image/*"
          disabled={busy}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void upload(f);
            e.target.value = '';
          }}
        />
        {value && (
          <button type="button" className="btn btn-ghost small" onClick={() => onChange('')}>
            Remove
          </button>
        )}
      </div>
      {busy && <p className="help">Uploading…</p>}
      {error && <p className="help" style={{ color: '#b3261e' }}>{error}</p>}
    </div>
  );
}

export default function FieldInput({
  field, value, onChange, imageFolder = 'misc',
}: {
  field: Field;
  value: Value;
  onChange: (name: string, value: Value) => void;
  imageFolder?: string;
}) {
  const id = useId();
  const set = (v: Value) => onChange(field.name, v);
  const str = value == null ? '' : String(value);
  const cls = `field${field.wide ? ' wide' : ''}${field.type === 'checkbox' ? ' check wide' : ''}`;

  return (
    <div className={cls}>
      {field.type === 'checkbox' ? (
        <label>
          <input type="checkbox" checked={Boolean(value)} onChange={(e) => set(e.target.checked)} />
          {field.label}
        </label>
      ) : (
        <>
          <label htmlFor={id}>{field.label}{field.required ? ' *' : ''}</label>
          {field.type === 'textarea' ? (
            <textarea id={id} rows={field.rows ?? 4} required={field.required} value={str}
              onChange={(e) => set(e.target.value)} />
          ) : field.type === 'select' ? (
            <select id={id} required={field.required} value={str} onChange={(e) => set(e.target.value)}>
              {field.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          ) : field.type === 'image' ? (
            <ImageInput value={str} onChange={(v) => set(v)} folder={imageFolder} />
          ) : (
            <input
              id={id}
              type={field.type === 'url' ? 'url' : field.type}
              required={field.required}
              value={str}
              onChange={(e) => set(e.target.value)}
            />
          )}
        </>
      )}
      {field.help && <p className="help">{field.help}</p>}
    </div>
  );
}

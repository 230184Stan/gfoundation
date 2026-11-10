import { createPublicClient } from './supabase/public';
import { DEFAULT_SETTINGS } from './defaults';
import { todayInPNG } from './format';
import type {
  EventRow, NewsRow, Pillar, Program, SiteSettings, TeamMember,
} from './types';

type Order = { column: string; ascending?: boolean };

async function listPublished<T>(table: string, order: Order[]): Promise<T[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];
  let query = supabase.from(table).select('*').eq('is_published', true);
  for (const o of order) query = query.order(o.column, { ascending: o.ascending ?? true });
  const { data, error } = await query;
  if (error) {
    console.error(`[data] failed to load ${table}:`, error.message);
    return [];
  }
  return (data ?? []) as T[];
}

export async function getSettings(): Promise<SiteSettings> {
  const settings: SiteSettings = structuredClone(DEFAULT_SETTINGS);
  const supabase = createPublicClient();
  if (!supabase) return settings;

  const { data, error } = await supabase.from('site_settings').select('key, value');
  if (error) {
    console.error('[data] failed to load site_settings:', error.message);
    return settings;
  }
  for (const row of data ?? []) {
    const key = row.key as keyof SiteSettings;
    if (key in settings) {
      settings[key] = { ...settings[key], ...(row.value as object) } as never;
    }
  }
  return settings;
}

export const getPillars = () =>
  listPublished<Pillar>('pillars', [{ column: 'sort_order' }, { column: 'created_at' }]);

export const getPrograms = () =>
  listPublished<Program>('programs', [{ column: 'sort_order' }, { column: 'created_at' }]);

export const getNews = () =>
  listPublished<NewsRow>('news', [
    { column: 'published_on', ascending: false },
    { column: 'created_at', ascending: false },
  ]);

export const getTeam = () =>
  listPublished<TeamMember>('team_members', [{ column: 'sort_order' }, { column: 'created_at' }]);

/** Upcoming = today or later (soonest first). Past = earlier (most recent first). */
export async function getEvents(): Promise<{ upcoming: EventRow[]; past: EventRow[] }> {
  const all = await listPublished<EventRow>('events', [{ column: 'event_date' }]);
  const today = todayInPNG();
  return {
    upcoming: all.filter((e) => e.event_date >= today),
    past: all.filter((e) => e.event_date < today).reverse(),
  };
}

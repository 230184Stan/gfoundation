export type Pillar = {
  id: string;
  icon: string;
  title: string;
  description: string;
  sort_order: number;
  is_published: boolean;
};

export type Program = {
  id: string;
  title: string;
  description: string;
  sort_order: number;
  is_published: boolean;
};

export const EVENT_BADGES = [
  'workshop',
  'outreach',
  'seminar',
  'donation',
  'launch',
  'service',
  'training',
] as const;
export type EventBadge = (typeof EVENT_BADGES)[number];

export type EventRow = {
  id: string;
  title: string;
  description: string;
  event_date: string; // YYYY-MM-DD
  badge: EventBadge;
  location: string | null;
  time_label: string | null;
  outcome: string | null;
  is_published: boolean;
};

export type NewsRow = {
  id: string;
  title: string;
  body: string;
  tag: string;
  published_on: string; // YYYY-MM-DD
  date_label: string | null;
  source_url: string | null;
  source_label: string | null;
  image_url: string | null;
  is_published: boolean;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  photo_url: string | null;
  group_name: 'executive' | 'training';
  sort_order: number;
  is_published: boolean;
};

export type MessageRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type GeneralSettings = {
  org_name: string;
  representative: string;
  email: string;
  phone: string;
  location: string;
  facebook_url: string;
};
export type HomeSettings = {
  eyebrow: string;
  title: string;
  subtitle: string;
  mission_quote: string;
};
export type AboutSettings = {
  vision: string;
  mission: string;
  location_text: string;
};
export type PartnersSettings = { text: string };

export type SiteSettings = {
  general: GeneralSettings;
  home: HomeSettings;
  about: AboutSettings;
  partners: PartnersSettings;
};

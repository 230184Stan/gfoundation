import { EVENT_BADGES } from '@/lib/types';

export type FieldType =
  | 'text' | 'textarea' | 'url' | 'date' | 'number' | 'select' | 'image' | 'checkbox';

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  wide?: boolean;
  help?: string;
  options?: { value: string; label: string }[];
  rows?: number;
};

export type ResourceConfig = {
  table: string;
  title: string;
  hint: string;
  addLabel: string;
  fields: Field[];
  primary: string;          // field shown as the row title
  secondary?: string;       // field shown under it
  thumb?: string;           // image field shown as a thumbnail
  order: { column: string; ascending?: boolean }[];
  imageFolder?: string;
};

const publishedField: Field = {
  name: 'is_published',
  label: 'Visible on the website',
  type: 'checkbox',
};
const sortField: Field = {
  name: 'sort_order',
  label: 'Order',
  type: 'number',
  help: 'Lower numbers appear first.',
};

export const RESOURCES: Record<string, ResourceConfig> = {
  pillars: {
    table: 'pillars',
    title: 'Home page: What We Stand For',
    hint: 'The cards shown on the home page.',
    addLabel: 'Add card',
    primary: 'title',
    secondary: 'description',
    order: [{ column: 'sort_order' }],
    fields: [
      { name: 'icon', label: 'Icon (emoji)', type: 'text', required: true },
      sortField,
      { name: 'title', label: 'Title', type: 'text', required: true, wide: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true, wide: true },
      publishedField,
    ],
  },
  programs: {
    table: 'programs',
    title: 'Core programs',
    hint: 'Numbered automatically in the order below.',
    addLabel: 'Add program',
    primary: 'title',
    secondary: 'description',
    order: [{ column: 'sort_order' }],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true, wide: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true, wide: true },
      sortField,
      publishedField,
    ],
  },
  events: {
    table: 'events',
    title: 'Events',
    hint: 'Events move from “Upcoming” to “Past” automatically once their date has passed.',
    addLabel: 'Add event',
    primary: 'title',
    secondary: 'event_date',
    order: [{ column: 'event_date', ascending: false }],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true, wide: true },
      { name: 'event_date', label: 'Date', type: 'date', required: true },
      {
        name: 'badge',
        label: 'Type',
        type: 'select',
        required: true,
        options: EVENT_BADGES.map((b) => ({ value: b, label: b[0].toUpperCase() + b.slice(1) })),
      },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'time_label', label: 'Time', type: 'text', help: 'e.g. 9:00 AM – 4:00 PM (shown on upcoming events).' },
      { name: 'description', label: 'Description', type: 'textarea', wide: true },
      { name: 'outcome', label: 'Outcome', type: 'text', wide: true, help: 'Shown once the event is in the past, e.g. “120 youth attended”.' },
      publishedField,
    ],
  },
  news: {
    table: 'news',
    title: 'News posts',
    hint: 'Newest first. Leave “Date shown as” empty to display the full date.',
    addLabel: 'Add news post',
    primary: 'title',
    secondary: 'tag',
    thumb: 'image_url',
    imageFolder: 'news',
    order: [{ column: 'published_on', ascending: false }],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true, wide: true },
      { name: 'tag', label: 'Tag', type: 'text', required: true, help: 'e.g. Announcement, Media Coverage, Feature Story' },
      { name: 'published_on', label: 'Date', type: 'date', required: true },
      { name: 'date_label', label: 'Date shown as (optional)', type: 'text', help: 'e.g. “July 2026”.' },
      { name: 'body', label: 'Text', type: 'textarea', required: true, wide: true, rows: 7 },
      { name: 'image_url', label: 'Image (optional)', type: 'image', wide: true },
      { name: 'source_url', label: 'Source link (optional)', type: 'url' },
      { name: 'source_label', label: 'Link text', type: 'text', help: 'e.g. Read more at The National' },
      publishedField,
    ],
  },
  team: {
    table: 'team_members',
    title: 'Team members',
    hint: 'Executive team and training committee shown on the About page.',
    addLabel: 'Add team member',
    primary: 'name',
    secondary: 'role',
    thumb: 'photo_url',
    imageFolder: 'team',
    order: [{ column: 'group_name' }, { column: 'sort_order' }],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'role', label: 'Role', type: 'text', required: true },
      {
        name: 'group_name',
        label: 'Group',
        type: 'select',
        required: true,
        options: [
          { value: 'executive', label: 'Executive Team' },
          { value: 'training', label: 'Training Committee' },
        ],
      },
      sortField,
      { name: 'photo_url', label: 'Photo', type: 'image', wide: true },
      publishedField,
    ],
  },
};

export type SettingsGroup = { key: string; title: string; fields: Field[] };

export const SETTINGS_GROUPS: SettingsGroup[] = [
  {
    key: 'general',
    title: 'Organisation & contact details',
    fields: [
      { name: 'org_name', label: 'Organisation name', type: 'text', required: true },
      { name: 'representative', label: 'Representative', type: 'text' },
      { name: 'email', label: 'Email', type: 'text', required: true },
      { name: 'phone', label: 'Phone', type: 'text', required: true },
      { name: 'location', label: 'Location', type: 'text', wide: true },
      { name: 'facebook_url', label: 'Facebook link', type: 'url', wide: true },
    ],
  },
  {
    key: 'home',
    title: 'Home page banner & mission',
    fields: [
      { name: 'eyebrow', label: 'Small heading above title', type: 'text', wide: true },
      { name: 'title', label: 'Big title', type: 'textarea', rows: 3, wide: true, help: 'One line per word/phrase.' },
      { name: 'subtitle', label: 'Subtitle', type: 'textarea', rows: 2, wide: true },
      { name: 'mission_quote', label: 'Mission quote', type: 'textarea', rows: 3, wide: true },
    ],
  },
  {
    key: 'about',
    title: 'About page',
    fields: [
      { name: 'vision', label: 'Our Vision', type: 'textarea', rows: 4, wide: true },
      { name: 'mission', label: 'Our Mission', type: 'textarea', rows: 3, wide: true },
      { name: 'location_text', label: 'Our Location', type: 'textarea', rows: 3, wide: true },
    ],
  },
  {
    key: 'partners',
    title: 'Partnerships section (Programs page)',
    fields: [{ name: 'text', label: 'Partnerships text', type: 'textarea', rows: 4, wide: true }],
  },
];

/** Optional text fields: an empty box is stored as NULL rather than ''. */
export const NULLABLE_FIELDS = new Set(['location', 'time_label', 'outcome', 'date_label', 'source_label']);

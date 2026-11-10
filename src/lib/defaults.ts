import type { SiteSettings } from './types';

/** Shown if the database has no value yet (or Supabase isn't configured). */
export const DEFAULT_SETTINGS: SiteSettings = {
  general: {
    org_name: 'Gamuna Foundation',
    representative: 'Nicholas Gamuna',
    email: 'stanissika@outlook.com',
    phone: '(675) 7988 8330',
    location: 'Madang Province, Papua New Guinea',
    facebook_url: 'https://www.facebook.com/profile.php?id=61585581315098',
  },
  home: {
    eyebrow: 'Est. 2026 · Madang Province, PNG',
    title: 'Advocate\nMotivate\nInspire',
    subtitle:
      'Empowering the youth of Papua New Guinea through education, advocacy, and community action.',
    mission_quote:
      'To empower young people through education, advocacy, and community engagement, enabling them to overcome challenges and achieve their full potential.',
  },
  about: {
    vision:
      'To create a vibrant and empowered generation of young leaders and communities who contribute positively to society, fostering sustainable development and community resilience in Madang and in Papua New Guinea.',
    mission:
      'To empower young people through education, advocacy, and community engagement, enabling them to overcome challenges and achieve their full potential.',
    location_text:
      'We operate in the heart of Madang Province, Papua New Guinea, engaging directly with both urban and rural communities to understand their unique challenges.',
  },
  partners: {
    text: 'We actively collaborate with international organizations, local governments, and community stakeholders to maximize impact and foster sustainable development.',
  },
};

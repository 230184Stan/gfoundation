'use server';

import { redirect } from 'next/navigation';
import { createPublicClient } from '@/lib/supabase/public';

const clean = (v: FormDataEntryValue | null, max: number) =>
  String(v ?? '').trim().slice(0, max);

export async function submitMessage(formData: FormData) {
  // Honeypot: real visitors never fill this hidden field.
  if (clean(formData.get('website'), 10)) redirect('/contact/thank-you');

  const name = clean(formData.get('name'), 120);
  const email = clean(formData.get('email'), 200);
  const phone = clean(formData.get('phone'), 40);
  const subject = clean(formData.get('subject'), 80);
  const message = clean(formData.get('message'), 5000);

  if (!name || !message || !/^\S+@\S+\.\S+$/.test(email)) redirect('/contact?error=invalid');

  const supabase = createPublicClient();
  if (!supabase) redirect('/contact?error=unavailable');

  const { error } = await supabase.from('messages').insert({
    name,
    email,
    phone: phone || null,
    subject: subject || null,
    message,
  });
  if (error) {
    console.error('[contact] insert failed:', error.message);
    redirect('/contact?error=failed');
  }

  redirect('/contact/thank-you');
}

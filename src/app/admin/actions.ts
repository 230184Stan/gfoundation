'use server';

import { revalidatePath } from 'next/cache';

/** Called by the dashboard after any save so visitors see changes immediately. */
export async function revalidateSite() {
  revalidatePath('/', 'layout');
}

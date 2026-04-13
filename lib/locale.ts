'use server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function setLocale(locale: string) {
  const store = await cookies();
  store.set('locale', locale);
  revalidatePath('/'); // Forces the layout and page to re-fetch translations
}
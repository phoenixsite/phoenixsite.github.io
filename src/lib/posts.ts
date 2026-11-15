import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../config';

// Devuelve los posts de un idioma, sin borradores y del más nuevo al más antiguo
export async function getPosts(lang: Lang): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getCollection('blog', (p) => p.data.lang === lang && !p.data.draft);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

// "es/mi-post" -> "mi-post": la URL no incluye el idioma, que ya va en el prefijo
export function postSlug(id: string): string {
  return id.replace(/^(es|en)\//, '');
}

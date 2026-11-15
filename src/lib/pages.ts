import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../config';
import { postSlug } from './posts';

// Páginas fijas de un idioma (src/content/pages/<idioma>/...)
export async function getPages(lang: Lang): Promise<CollectionEntry<'pages'>[]> {
  return getCollection('pages', (p) => p.data.lang === lang);
}

// "es/cv" -> "cv": la URL no incluye el idioma, que ya va en el prefijo
export const pageSlug = postSlug;

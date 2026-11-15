import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Posts en src/content/blog/<idioma>/<nombre>.md (por ejemplo es/mi-post.md)
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    lang: z.enum(['es', 'en']),
    draft: z.boolean().default(false)
  })
});

// Páginas fijas (CV, proyectos...) en src/content/pages/<idioma>/<nombre>.md o .mdx.
// La URL es /<nombre>/ en español y /en/<nombre>/ en inglés.
const pages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    lang: z.enum(['es', 'en']),
    // Ruta de la misma página en el otro idioma (sin /en). Si no se indica,
    // se asume el mismo nombre: /<nombre>/
    altPath: z.string().optional()
  })
});

export const collections = { blog, pages };

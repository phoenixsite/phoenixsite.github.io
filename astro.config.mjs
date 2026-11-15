// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

import { siteConfig } from './src/config';

// https://astro.build/config
export default defineConfig({
  site: siteConfig.url,
  integrations: [mdx(), react(), sitemap()],
  // Fórmulas en Markdown: $...$ en línea y $$...$$ en bloque, renderizadas con KaTeX
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex]
  },
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    // El español vive en "/" y el inglés en "/en/", como en la versión Jekyll
    routing: { prefixDefaultLocale: false }
  }
});

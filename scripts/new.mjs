#!/usr/bin/env node
// Crea un post o una página en Markdown con el front matter ya relleno.
//
//   pnpm new post "Título del post"                 -> src/content/blog/es/titulo-del-post.md
//   pnpm new post "My post" --lang en               -> src/content/blog/en/my-post.md
//   pnpm new post "Título" --lang both --slug demo  -> es/demo.md y en/demo.md
//   pnpm new page "Contacto" --alt /contact/        -> src/content/pages/es/contacto.md
//   pnpm new page "Demo" --mdx                      -> .mdx (permite componentes)
import { access, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const USAGE = `Uso:
  pnpm new post "Título" [--lang es|en|both] [--slug nombre]
  pnpm new page "Título" [--lang es|en|both] [--slug nombre] [--alt /ruta/] [--mdx]`;

function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith('--')) {
      positional.push(arg);
    } else if (arg === '--mdx') {
      flags.mdx = true;
    } else {
      flags[arg.slice(2)] = argv[++i];
    }
  }
  return { positional, flags };
}

// "Título con tildes!" -> "titulo-con-tildes"
function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const today = new Date().toISOString().slice(0, 10);

// Texto de relleno en el idioma del fichero, para que el corrector ortográfico no lo marque
const placeholder = {
  es: 'Escribe aquí el contenido.',
  en: 'Write the content here.'
};

function postTemplate(title, lang) {
  return `---
title: ${JSON.stringify(title)}
description: ""
pubDate: ${today}
lang: ${lang}
draft: true
---

${placeholder[lang]}
`;
}

function pageTemplate(title, lang, altPath) {
  return `---
title: ${JSON.stringify(title)}
lang: ${lang}
altPath: ${altPath}
---

${placeholder[lang]}
`;
}

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const [kind, ...rest] = process.argv.slice(2);
  const { positional, flags } = parseArgs(rest);
  const title = positional[0];

  if (!['post', 'page'].includes(kind) || !title) {
    console.error(USAGE);
    process.exit(1);
  }

  const langFlag = flags.lang ?? 'es';
  if (!['es', 'en', 'both'].includes(langFlag)) {
    console.error(`Idioma no válido: "${langFlag}". Usa es, en o both.\n\n${USAGE}`);
    process.exit(1);
  }
  const langs = langFlag === 'both' ? ['es', 'en'] : [langFlag];

  const slug = flags.slug ? slugify(flags.slug) : slugify(title);
  if (!slug) {
    console.error('No se pudo generar un nombre de fichero a partir del título. Usa --slug.');
    process.exit(1);
  }

  const ext = kind === 'page' && flags.mdx ? 'mdx' : 'md';
  const baseDir = kind === 'post' ? 'src/content/blog' : 'src/content/pages';
  const altPath = flags.alt ?? `/${slug}/`;

  for (const lang of langs) {
    const file = path.join(baseDir, lang, `${slug}.${ext}`);
    if (await exists(file)) {
      console.error(`Ya existe, no lo sobrescribo: ${file}`);
      process.exit(1);
    }
    await mkdir(path.dirname(file), { recursive: true });
    const content = kind === 'post' ? postTemplate(title, lang) : pageTemplate(title, lang, altPath);
    await writeFile(file, content);
    const url = `${lang === 'en' ? '/en' : ''}/${kind === 'post' ? 'blog/' : ''}${slug}/`;
    console.log(`Creado ${file}  ->  ${url}`);
  }

  if (kind === 'post') {
    console.log('El post se crea con "draft: true": quítalo cuando quieras publicarlo.');
  } else {
    console.log('Si la página debe salir en el menú, añádela a navItems en src/layouts/Base.astro.');
  }
}

main();

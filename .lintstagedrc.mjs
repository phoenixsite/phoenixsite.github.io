// Se ejecuta en cada commit solo sobre los ficheros Markdown/MDX preparados (staged).
// Los comandos de un mismo fichero van en serie: formato, reglas de estilo y ortografía.
const quote = (files) => files.map((f) => JSON.stringify(f)).join(' ');

export default {
  '*.{md,mdx}': (files) => {
    const commands = [`prettier --write ${quote(files)}`];
    // markdownlint no entiende MDX (imports, JSX), así que solo revisa los .md
    const md = files.filter((f) => f.endsWith('.md'));
    if (md.length > 0) commands.push(`markdownlint-cli2 --fix ${quote(md)}`);
    // Ortografía: español en .../es/..., inglés en .../en/... (ver cspell.json)
    commands.push(`cspell --no-progress --no-summary ${quote(files)}`);
    return commands;
  }
};

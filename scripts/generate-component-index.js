/**
 * Generates a code-derived index of shared components in `src/components/`.
 *
 * This is the "inventory of fact" half of Psycron's anti-duplication system:
 * it is derived from the source on every run, so it can never drift from the
 * code the way a hand-written catalogue does. The "catalogue of intent" (which
 * component to reach for and why) lives in the Obsidian vault, not here.
 *
 * The output (`docs/COMPONENTS.md`) is intentionally gitignored and regenerated
 * on demand — run it (or `npm run components:index`) and READ it before building
 * any new UI, so you extend an existing component instead of duplicating one.
 *
 * Usage: node scripts/generate-component-index.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const COMPONENTS_DIR = path.join(ROOT, 'src', 'components');
const OUTPUT = path.join(ROOT, 'docs', 'COMPONENTS.md');

const isTsx = (f) => f.endsWith('.tsx') || f.endsWith('.ts');
const isNoise = (f) =>
  f.endsWith('.styles.tsx') ||
  f.endsWith('.types.ts') ||
  f.endsWith('.types.tsx') ||
  f.endsWith('.stories.tsx') ||
  f.endsWith('.test.tsx') ||
  f.endsWith('.test.ts') ||
  f === 'index.tsx' ||
  f === 'index.ts';

/** Extracts the first exported component name from a source file. */
const findExportName = (src, fallback) => {
  const patterns = [
    /export\s+const\s+([A-Z]\w+)/,
    /export\s+function\s+([A-Z]\w+)/,
    /export\s+default\s+(?:function\s+)?([A-Z]\w+)/,
    /export\s+\{\s*([A-Z]\w+)/,
  ];
  for (const re of patterns) {
    const m = src.match(re);
    if (m) return m[1];
  }
  return fallback;
};

/** Extracts the props type/interface name if one is referenced or defined. */
const findPropsType = (src) => {
  const m =
    src.match(/(?:interface|type)\s+(\w*Props)\b/) ||
    src.match(/:\s*(?:FC|FunctionComponent)<\s*(\w+)\s*>/) ||
    src.match(/:\s*(\w*Props)\b/);
  return m ? m[1] : null;
};

/** Extracts the first JSDoc/line-comment description above the export, if any. */
const findDocLine = (src) => {
  const jsdoc = src.match(/\/\*\*\s*\n?\s*\*?\s*([^\n*][^\n]*)/);
  if (jsdoc) return jsdoc[1].trim().replace(/\s*\*\/\s*$/, '');
  return null;
};

/** Returns the main component file inside a folder (PascalCase match preferred). */
const pickMainFile = (folderPath, folderName) => {
  const files = fs.readdirSync(folderPath).filter((f) => isTsx(f) && !isNoise(f));
  if (files.length === 0) return null;
  const pascal = folderName
    .split(/[-_]/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join('');
  return files.find((f) => f === `${pascal}.tsx`) || files[0];
};

const folders = fs
  .readdirSync(COMPONENTS_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

const rows = [];
for (const folder of folders) {
  const folderPath = path.join(COMPONENTS_DIR, folder);
  const mainFile = pickMainFile(folderPath, folder);
  if (!mainFile) continue;

  const src = fs.readFileSync(path.join(folderPath, mainFile), 'utf8');
  const allFiles = fs.readdirSync(folderPath);
  const exportName = findExportName(src, mainFile.replace(/\.tsx?$/, ''));
  const propsType = findPropsType(src);
  const hasStories = allFiles.some((f) => f.endsWith('.stories.tsx'));
  const subComponents = fs
    .readdirSync(folderPath, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
  const doc = findDocLine(src);

  rows.push({
    folder,
    exportName,
    propsType: propsType || '—',
    stories: hasStories ? '✓' : '',
    subs: subComponents.join(', ') || '—',
    doc: doc || '',
  });
}

const date = new Date().toISOString().slice(0, 10);
const lines = [
  '# Psycron FE — Shared Component Index (auto-generated)',
  '',
  '> Generated from `src/components/` by `scripts/generate-component-index.js`.',
  '> Do not edit by hand — regenerate with `npm run components:index`.',
  '> This is the inventory of FACT. The catalogue of INTENT (which component to',
  '> reach for and why) lives in the Obsidian vault: `04 Engineering/Component Conventions`.',
  '',
  `_Last generated: ${date} · ${rows.length} shared components._`,
  '',
  '| Folder | Export | Props type | Stories | Sub-components | Notes |',
  '|---|---|---|:---:|---|---|',
  ...rows.map(
    (r) =>
      `| \`${r.folder}\` | \`${r.exportName}\` | \`${r.propsType}\` | ${r.stories} | ${r.subs} | ${r.doc} |`,
  ),
  '',
  '## Before building a new component',
  '',
  '1. Find the closest match above and read its source in `src/components/<folder>/`.',
  '2. If it covers your case — use it. If it almost covers it — **extend or compose it**, do not fork.',
  '3. Only create a new shared component when no existing one fits, and place it in `src/components/<domain>/`.',
  '4. Never leave two components that do the same job. If you spot a duplicate, flag it and abstract.',
  '',
];

fs.writeFileSync(OUTPUT, lines.join('\n'));
console.log(`Wrote ${OUTPUT} — ${rows.length} components indexed.`);

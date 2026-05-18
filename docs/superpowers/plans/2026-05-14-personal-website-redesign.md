# Personal Website Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `shylenko.com` as an Astro-based, writing-forward personal brand site with migrated notes, dedicated project pages, and preserved legacy post URLs.

**Architecture:** Replace the Jekyll runtime with a static Astro site in the same repository. Keep legacy content/assets as inputs, migrate posts into Astro content collections, and render the site through focused layouts/components. Preserve old `/:title/` URLs with generated redirect pages.

**Tech Stack:** Astro, TypeScript, Astro content collections, Markdown, plain CSS, Node migration scripts, GitHub Pages static deployment.

---

## File Structure

Create:

- `package.json` - Astro scripts and dependencies.
- `astro.config.mjs` - Astro site configuration for `https://shylenko.com`.
- `tsconfig.json` - Astro TypeScript baseline.
- `src/content/config.ts` - `notes` and `projects` collection schemas.
- `src/content/projects/labwired.md` - Labwired project entry.
- `src/content/projects/kernelcad.md` - kernelCAD project entry.
- `src/content/projects/uds.md` - UDS project entry.
- `src/content/projects/iolink.md` - IO-Link project entry.
- `src/data/site.ts` - shared site metadata, nav, social links, proof points.
- `src/lib/notes.ts` - note sorting, featured selection, tag aggregation, slug helpers.
- `src/layouts/BaseLayout.astro` - document shell, SEO metadata, global header/footer.
- `src/layouts/ProseLayout.astro` - article/page content layout.
- `src/layouts/ProjectLayout.astro` - project detail layout.
- `src/components/SiteHeader.astro` - primary navigation.
- `src/components/SiteFooter.astro` - footer links.
- `src/components/NoteCard.astro` - note summary card.
- `src/components/ProjectCard.astro` - project summary card.
- `src/components/TagFilter.astro` - non-JS tag links/filter UI.
- `src/pages/index.astro` - homepage.
- `src/pages/notes/index.astro` - notes index.
- `src/pages/notes/[slug].astro` - note detail route.
- `src/pages/projects/index.astro` - projects index.
- `src/pages/projects/[slug].astro` - project detail route.
- `src/pages/about.astro` - rewritten about page.
- `src/pages/rss.xml.js` - RSS feed.
- `src/pages/sitemap.xml.js` - sitemap.
- `src/styles/global.css` - site-wide styles and design tokens.
- `src/pages/404.astro` - custom 404.
- `scripts/migrate-posts.mjs` - Jekyll-to-Astro content migration.
- `scripts/create-redirect-pages.mjs` - legacy URL redirect page generator.
- `src/content/notes/*.md` - generated migrated notes.
- `public/legacy-redirects/*/index.html` or root redirect pages - generated redirect output if Astro route redirects are insufficient for GitHub Pages.
- `.github/workflows/deploy.yml` - GitHub Pages build/deploy workflow.

Modify:

- `.gitignore` - add `.superpowers/` and Astro build artifacts.
- `CNAME` - keep `shylenko.com`.

Do not manually delete legacy Jekyll files until the Astro build, migration, and redirects are verified. They can remain unused during the first implementation.

---

## Task 1: Add Astro Baseline

**Files:**

- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/styles/global.css`
- Create: `src/data/site.ts`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/SiteHeader.astro`
- Create: `src/components/SiteFooter.astro`
- Modify: `.gitignore`

- [ ] **Step 1: Update `.gitignore` for Astro**

Remove the existing `package.json` ignore line because the Astro package manifest must be tracked. Then append these lines if they are not already present:

```gitignore
.superpowers/
dist/
.astro/
```

- [ ] **Step 2: Create `package.json`**

```json
{
  "name": "w1ne-github-io",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "migrate:posts": "node scripts/migrate-posts.mjs",
    "generate:redirects": "node scripts/create-redirect-pages.mjs"
  },
  "dependencies": {
    "@astrojs/check": "^0.9.4",
    "@astrojs/rss": "^4.0.11",
    "astro": "^5.0.0",
    "gray-matter": "^4.0.3",
    "typescript": "^5.6.3"
  },
  "devDependencies": {}
}
```

- [ ] **Step 3: Create `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://shylenko.com',
  output: 'static',
  trailingSlash: 'always'
});
```

- [ ] **Step 4: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

- [ ] **Step 5: Create `src/data/site.ts`**

```ts
export const site = {
  name: 'Andrii Shylenko',
  title: 'Andrii Shylenko - Practical notes from building connected systems',
  description:
    'Engineering notes and project proof from embedded systems, IoT architecture, firmware validation, and productization.',
  url: 'https://shylenko.com',
  email: 'andrii@shylenko.com',
  avatar: '/images/logoAS_blue_white.png',
  nav: [
    { href: '/', label: 'Home' },
    { href: '/notes/', label: 'Notes' },
    { href: '/projects/', label: 'Projects' },
    { href: '/about/', label: 'About' }
  ],
  socials: [
    { href: 'https://github.com/w1ne', label: 'GitHub' },
    { href: 'https://www.linkedin.com/in/andrewshylenko/', label: 'LinkedIn' },
    { href: 'https://twitter.com/AndriiShylenko', label: 'Twitter' },
    { href: 'mailto:andrii@shylenko.com', label: 'Email' }
  ],
  proofPoints: [
    'Embedded and industrial IoT systems',
    'Firmware architecture and validation',
    'Connected products from prototype to field',
    'Open-source tools and engineering notes'
  ]
} as const;
```

- [ ] **Step 6: Create `src/styles/global.css`**

```css
:root {
  color-scheme: light;
  --bg: #f8f7f3;
  --surface: #ffffff;
  --surface-muted: #eeece5;
  --text: #202124;
  --muted: #65645f;
  --border: #d8d4c9;
  --accent: #0b5cad;
  --accent-strong: #083f78;
  --code-bg: #efede7;
  --max-width: 1080px;
  --content-width: 760px;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-size: 18px;
  line-height: 1.6;
}

a {
  color: var(--accent);
  text-decoration-thickness: 0.08em;
  text-underline-offset: 0.16em;
}

a:hover {
  color: var(--accent-strong);
}

img {
  max-width: 100%;
  height: auto;
}

.site-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  width: min(100% - 32px, var(--max-width));
  margin-inline: auto;
}

.content {
  width: min(100% - 32px, var(--content-width));
  margin-inline: auto;
}

.main {
  flex: 1;
}

.eyebrow {
  margin: 0 0 8px;
  color: var(--muted);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.button {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 16px;
  border: 1px solid var(--accent);
  border-radius: 6px;
  background: var(--accent);
  color: #fff;
  font-weight: 700;
  text-decoration: none;
}

.button:hover {
  background: var(--accent-strong);
  color: #fff;
}

.button.secondary {
  background: transparent;
  color: var(--accent);
}

.grid {
  display: grid;
  gap: 18px;
}

@media (min-width: 760px) {
  .grid.two {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .grid.three {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.card {
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  padding: 18px;
}

.prose h1,
.prose h2,
.prose h3 {
  line-height: 1.2;
}

.prose pre {
  overflow-x: auto;
  padding: 16px;
  border-radius: 8px;
  background: var(--code-bg);
}

.prose code {
  background: var(--code-bg);
  padding: 0.1em 0.25em;
  border-radius: 4px;
}

.prose pre code {
  padding: 0;
  background: transparent;
}
```

- [ ] **Step 7: Create `src/components/SiteHeader.astro`**

```astro
---
import { site } from '../data/site';
---

<header class="site-header">
  <div class="container header-inner">
    <a class="brand" href="/">
      <img src={site.avatar} alt="" width="34" height="34" />
      <span>{site.name}</span>
    </a>
    <nav aria-label="Main navigation">
      {site.nav.map((item) => <a href={item.href}>{item.label}</a>)}
    </nav>
  </div>
</header>

<style>
  .site-header {
    border-bottom: 1px solid var(--border);
    background: color-mix(in srgb, var(--bg) 92%, white);
  }

  .header-inner {
    min-height: 72px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }

  .brand {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    color: var(--text);
    font-weight: 800;
    text-decoration: none;
  }

  .brand img {
    border-radius: 5px;
  }

  nav {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  nav a {
    color: var(--muted);
    font-size: 0.95rem;
    font-weight: 700;
    text-decoration: none;
  }

  nav a:hover {
    color: var(--text);
  }

  @media (max-width: 560px) {
    .header-inner {
      align-items: flex-start;
      flex-direction: column;
      padding-block: 16px;
    }
  }
</style>
```

- [ ] **Step 8: Create `src/components/SiteFooter.astro`**

```astro
---
import { site } from '../data/site';
---

<footer class="site-footer">
  <div class="container footer-inner">
    <p>&copy; {new Date().getFullYear()} {site.name}</p>
    <nav aria-label="Footer links">
      {site.socials.map((item) => <a href={item.href}>{item.label}</a>)}
      <a href="/rss.xml">RSS</a>
    </nav>
  </div>
</footer>

<style>
  .site-footer {
    margin-top: 72px;
    border-top: 1px solid var(--border);
    color: var(--muted);
  }

  .footer-inner {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    padding-block: 28px;
  }

  .footer-inner p {
    margin: 0;
  }

  nav {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
  }

  nav a {
    color: var(--muted);
    font-size: 0.95rem;
  }

  @media (max-width: 640px) {
    .footer-inner {
      flex-direction: column;
    }
  }
</style>
```

- [ ] **Step 9: Create `src/layouts/BaseLayout.astro`**

```astro
---
import SiteHeader from '../components/SiteHeader.astro';
import SiteFooter from '../components/SiteFooter.astro';
import { site } from '../data/site';
import '../styles/global.css';

interface Props {
  title?: string;
  description?: string;
}

const title = Astro.props.title ? `${Astro.props.title} - ${site.name}` : site.title;
const description = Astro.props.description ?? site.description;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={Astro.url.href} />
    <meta property="og:image" content={new URL(site.avatar, site.url).href} />
    <link rel="icon" href="/images/logoAS_blue_white.png" />
    <link rel="alternate" type="application/rss+xml" href="/rss.xml" title={`${site.name} RSS`} />
    <title>{title}</title>
  </head>
  <body>
    <div class="site-shell">
      <SiteHeader />
      <main class="main">
        <slot />
      </main>
      <SiteFooter />
    </div>
  </body>
</html>
```

- [ ] **Step 10: Install dependencies and run the first build**

Run:

```bash
npm install
npm run build
```

Expected:

- `npm install` creates `package-lock.json`.
- `npm run build` may fail because no pages exist yet. Acceptable failure: Astro reports no route/page content. Unexpected failures in config or imports must be fixed before continuing.

- [ ] **Step 11: Commit the baseline**

```bash
git add .gitignore package.json package-lock.json astro.config.mjs tsconfig.json src
git commit -m "chore: add Astro baseline"
```

---

## Task 2: Add Content Schemas And Note Utilities

**Files:**

- Create: `src/content/config.ts`
- Create: `src/lib/notes.ts`
- Create: `src/layouts/ProseLayout.astro`
- Create: `src/components/NoteCard.astro`
- Create: `src/components/TagFilter.astro`

- [ ] **Step 1: Create `src/content/config.ts`**

```ts
import { defineCollection, z } from 'astro:content';

const notes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().default(''),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    legacyUrl: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    heroImage: z.string().optional()
  })
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    summary: z.string(),
    status: z.string(),
    repoUrl: z.string().url().optional(),
    topics: z.array(z.string()).default([]),
    proofPoints: z.array(z.string()).default([]),
    featuredNotes: z.array(z.string()).default([])
  })
});

export const collections = { notes, projects };
```

- [ ] **Step 2: Create `src/lib/notes.ts`**

```ts
import type { CollectionEntry } from 'astro:content';

export type Note = CollectionEntry<'notes'>;

export function sortNotes(notes: Note[]): Note[] {
  return [...notes].sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function publishedNotes(notes: Note[]): Note[] {
  return notes.filter((note) => !note.data.draft);
}

export function featuredNotes(notes: Note[], limit = 5): Note[] {
  const featured = sortNotes(publishedNotes(notes)).filter((note) => note.data.featured);
  return featured.length > 0 ? featured.slice(0, limit) : sortNotes(publishedNotes(notes)).slice(0, limit);
}

export function allTags(notes: Note[]): string[] {
  return Array.from(new Set(publishedNotes(notes).flatMap((note) => note.data.tags))).sort((a, b) =>
    a.localeCompare(b)
  );
}

export function notesByTag(notes: Note[], tag: string): Note[] {
  return sortNotes(publishedNotes(notes).filter((note) => note.data.tags.includes(tag)));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}
```

- [ ] **Step 3: Create `src/layouts/ProseLayout.astro`**

```astro
---
import BaseLayout from './BaseLayout.astro';

interface Props {
  title: string;
  description?: string;
  eyebrow?: string;
}
---

<BaseLayout title={Astro.props.title} description={Astro.props.description}>
  <article class="content prose-page">
    {Astro.props.eyebrow && <p class="eyebrow">{Astro.props.eyebrow}</p>}
    <h1>{Astro.props.title}</h1>
    {Astro.props.description && <p class="lede">{Astro.props.description}</p>}
    <div class="prose">
      <slot />
    </div>
  </article>
</BaseLayout>

<style>
  .prose-page {
    padding-block: 56px 24px;
  }

  h1 {
    margin: 0;
    font-size: clamp(2.2rem, 6vw, 4rem);
    line-height: 1.05;
  }

  .lede {
    margin: 18px 0 32px;
    color: var(--muted);
    font-size: 1.2rem;
  }
</style>
```

- [ ] **Step 4: Create `src/components/NoteCard.astro`**

```astro
---
import type { Note } from '../lib/notes';
import { formatDate } from '../lib/notes';

interface Props {
  note: Note;
}

const { note } = Astro.props;
---

<article class="note-card card">
  <p class="meta">{formatDate(note.data.date)}</p>
  <h2><a href={`/notes/${note.slug}/`}>{note.data.title}</a></h2>
  {note.data.description && <p>{note.data.description}</p>}
  {note.data.tags.length > 0 && (
    <ul aria-label="Tags">
      {note.data.tags.slice(0, 4).map((tag) => <li>{tag}</li>)}
    </ul>
  )}
</article>

<style>
  .note-card {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .note-card > * {
    margin: 0;
  }

  .meta {
    color: var(--muted);
    font-size: 0.9rem;
  }

  h2 {
    font-size: 1.25rem;
    line-height: 1.25;
  }

  h2 a {
    color: var(--text);
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    list-style: none;
    padding: 0;
  }

  li {
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 2px 8px;
    color: var(--muted);
    font-size: 0.82rem;
  }
</style>
```

- [ ] **Step 5: Create `src/components/TagFilter.astro`**

```astro
---
interface Props {
  tags: string[];
  activeTag?: string;
}
---

<nav class="tag-filter" aria-label="Filter notes by tag">
  <a class={!Astro.props.activeTag ? 'active' : ''} href="/notes/">All</a>
  {Astro.props.tags.map((tag) => (
    <a class={Astro.props.activeTag === tag ? 'active' : ''} href={`/notes/?tag=${encodeURIComponent(tag)}`}>
      {tag}
    </a>
  ))}
</nav>

<style>
  .tag-filter {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 24px 0;
  }

  a {
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 5px 10px;
    color: var(--muted);
    font-size: 0.9rem;
    text-decoration: none;
  }

  a.active,
  a:hover {
    border-color: var(--accent);
    color: var(--accent);
  }
</style>
```

- [ ] **Step 6: Run type check**

Run:

```bash
npm run build
```

Expected: Build still may fail because pages/content are not complete, but TypeScript import/schema errors in the new files must be fixed.

- [ ] **Step 7: Commit content schemas and components**

```bash
git add src/content/config.ts src/lib/notes.ts src/layouts/ProseLayout.astro src/components/NoteCard.astro src/components/TagFilter.astro
git commit -m "feat: add content schemas and note components"
```

---

## Task 3: Add Migration And Redirect Scripts

**Files:**

- Create: `scripts/migrate-posts.mjs`
- Create: `scripts/create-redirect-pages.mjs`
- Create: `src/content/notes/.gitkeep`

- [ ] **Step 1: Create `src/content/notes/.gitkeep`**

Create an empty file so the generated notes directory exists before migration.

- [ ] **Step 2: Create `scripts/migrate-posts.mjs`**

```js
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import matter from 'gray-matter';

const root = process.cwd();
const postsDir = path.join(root, '_posts');
const outputDir = path.join(root, 'src/content/notes');

const featuredTitles = new Set([
  'IoT loco demo',
  'Folder structure of the embedded project',
  'Unlocking BIOS Supervisor password on Thinkpad T480',
  'Ship till you are dead'
]);

function slugify(input) {
  return input
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function titleFromFile(fileName) {
  return fileName.replace(/^\d{4}-\d{1,2}-\d{1,2}-/, '').replace(/\.md$/, '').replace(/[-_]+/g, ' ');
}

function dateFromFile(fileName) {
  const match = fileName.match(/^(\d{4})-(\d{1,2})-(\d{1,2})-/);
  if (!match) return '2000-01-01';
  const [, year, month, day] = match;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

function descriptionFromBody(body) {
  const plain = body
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!\[[^\]]*\]\([^)]+\)(\{:[^}]+\})?/g, '')
    .replace(/\[[^\]]+\]\([^)]+\)/g, (match) => match.replace(/^\[|\]\([^)]+\)$/g, ''))
    .replace(/<[^>]+>/g, '')
    .replace(/\{[%{][\s\S]*?[%}]\}/g, '')
    .replace(/[#>*_`~-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return plain.slice(0, 155);
}

function normalizeBody(body) {
  return body
    .replace(/\{\{\s*["']([^"']+)["']\s*\|\s*relative_url\s*\}\}/g, '$1')
    .replace(/\{\{\s*["']([^"']+)["']\s*\|\s*absolute_url\s*\}\}/g, '$1')
    .replace(/\{\%\s*include\s+youtube\.html\s+id=["']([^"']+)["']\s*\%\}/g, (_match, id) => {
      return `<iframe class="youtube-embed" src="https://www.youtube.com/embed/${id}" title="YouTube video" loading="lazy" allowfullscreen></iframe>`;
    })
    .replace(/\{\%\s*include\s+SelfEmployedCalculator\.html\s*\%\}/g, '> Legacy interactive calculator omitted during the Astro migration.')
    .replace(/\{\%\s*include\s+calculator_compounding\.html\s*\%\}/g, '> Legacy compounding calculator omitted during the Astro migration.')
    .replace(/\{\%\s*include\s+calcualtor_SPY_vs_Sell\.html\s*\%\}/g, '> Legacy options calculator omitted during the Astro migration.')
    .replace(/\)\{:\s*\.[^}]+\s*\}/g, ')')
    .replace(/\.png""/g, '.png"')
    .replace(/\t+/g, '');
}

async function listMarkdownFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return listMarkdownFiles(full);
      if (entry.isFile() && entry.name.endsWith('.md')) return [full];
      return [];
    })
  );
  return files.flat();
}

await fs.mkdir(outputDir, { recursive: true });
const files = await listMarkdownFiles(postsDir);

for (const file of files) {
  const raw = await fs.readFile(file, 'utf8');
  const parsed = matter(raw);
  const fileName = path.basename(file);
  const title = parsed.data.title ?? titleFromFile(fileName);
  const date = dateFromFile(fileName);
  const slug = slugify(title);
  const legacySlug = slugify(fileName.replace(/^\d{4}-\d{1,2}-\d{1,2}-/, '').replace(/\.md$/, ''));
  const body = normalizeBody(parsed.content);
  const frontmatter = {
    title,
    description: parsed.data.description ?? descriptionFromBody(body),
    date,
    tags: Array.isArray(parsed.data.tags) ? parsed.data.tags.map(String) : [],
    legacyUrl: `/${legacySlug}/`,
    featured: featuredTitles.has(title),
    draft: false,
    heroImage: parsed.data['featured-image'] ? `/images/img/${String(parsed.data['featured-image']).trim()}` : undefined
  };

  const output = matter.stringify(body.trim() + '\n', frontmatter);
  await fs.writeFile(path.join(outputDir, `${slug}.md`), output);
}

console.log(`Migrated ${files.length} posts to ${path.relative(root, outputDir)}`);
```

- [ ] **Step 3: Create `scripts/create-redirect-pages.mjs`**

```js
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import matter from 'gray-matter';

const root = process.cwd();
const notesDir = path.join(root, 'src/content/notes');
const redirectsDir = path.join(root, 'src/pages');

function redirectPage(destination) {
  return `---\nconst destination = '${destination}';\n---\n<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="utf-8" />\n    <meta http-equiv="refresh" content={\\`0;url=\\${destination}\\`} />\n    <link rel="canonical" href={destination} />\n    <title>Redirecting...</title>\n  </head>\n  <body>\n    <p>Redirecting to <a href={destination}>{destination}</a>.</p>\n  </body>\n</html>\n`;
}

const files = (await fs.readdir(notesDir)).filter((file) => file.endsWith('.md'));

for (const file of files) {
  const raw = await fs.readFile(path.join(notesDir, file), 'utf8');
  const parsed = matter(raw);
  if (!parsed.data.legacyUrl) continue;
  const legacyPath = String(parsed.data.legacyUrl).replace(/^\/|\/$/g, '');
  const destination = `/notes/${file.replace(/\.md$/, '')}/`;
  const outputDir = path.join(redirectsDir, legacyPath);
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(path.join(outputDir, 'index.astro'), redirectPage(destination));
}

console.log(`Generated redirects for ${files.length} notes`);
```

- [ ] **Step 4: Run migration scripts**

Run:

```bash
npm run migrate:posts
npm run generate:redirects
```

Expected:

- `Migrated 17 posts to src/content/notes`.
- Redirect pages are created under `src/pages/<legacy-slug>/index.astro`.

- [ ] **Step 5: Inspect generated content**

Run:

```bash
rg -n "\\{%|\\{\\{|\\): \\." src/content/notes src/pages
```

Expected: no remaining Liquid tags or Kramdown image class syntax. If any remain, update `scripts/migrate-posts.mjs`, delete generated `src/content/notes/*.md` and redirect pages, rerun scripts.

- [ ] **Step 6: Commit migration scripts and generated notes**

```bash
git add scripts src/content/notes src/pages/*/index.astro
git commit -m "feat: migrate Jekyll posts to Astro notes"
```

---

## Task 4: Add Note Routes, Feeds, And Basic Pages

**Files:**

- Create: `src/pages/notes/index.astro`
- Create: `src/pages/notes/[slug].astro`
- Create: `src/pages/rss.xml.js`
- Create: `src/pages/sitemap.xml.js`
- Create: `src/pages/404.astro`

- [ ] **Step 1: Create `src/pages/notes/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import NoteCard from '../../components/NoteCard.astro';
import TagFilter from '../../components/TagFilter.astro';
import { allTags, notesByTag, publishedNotes, sortNotes } from '../../lib/notes';

const notes = await getCollection('notes');
const tags = allTags(notes);
const activeTag = Astro.url.searchParams.get('tag') ?? undefined;
const visibleNotes = activeTag ? notesByTag(notes, activeTag) : sortNotes(publishedNotes(notes));
---

<BaseLayout title="Notes" description="Practical engineering notes from building connected systems.">
  <section class="content notes-head">
    <p class="eyebrow">Engineering Notes</p>
    <h1>Practical notes from building connected systems.</h1>
    <p>Embedded systems, IoT architecture, firmware validation, productization, and hard-won lessons from real work.</p>
    <TagFilter tags={tags} activeTag={activeTag} />
  </section>
  <section class="container grid two notes-list" aria-label="Notes">
    {visibleNotes.map((note) => <NoteCard note={note} />)}
  </section>
</BaseLayout>

<style>
  .notes-head {
    padding-block: 56px 20px;
  }

  h1 {
    margin: 0;
    font-size: clamp(2.2rem, 6vw, 4rem);
    line-height: 1.05;
  }

  .notes-head p:not(.eyebrow) {
    color: var(--muted);
    font-size: 1.15rem;
  }

  .notes-list {
    padding-block: 12px 32px;
  }
</style>
```

- [ ] **Step 2: Create `src/pages/notes/[slug].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import { formatDate } from '../../lib/notes';

export async function getStaticPaths() {
  const notes = await getCollection('notes', ({ data }) => !data.draft);
  return notes.map((note) => ({ params: { slug: note.slug }, props: { note } }));
}

const { note } = Astro.props;
const { Content } = await render(note);
---

<BaseLayout title={note.data.title} description={note.data.description}>
  <article class="content article">
    <p class="eyebrow">{formatDate(note.data.date)}</p>
    <h1>{note.data.title}</h1>
    {note.data.description && <p class="lede">{note.data.description}</p>}
    {note.data.heroImage && <img class="hero-image" src={note.data.heroImage} alt="" />}
    <div class="meta-tags" aria-label="Tags">
      {note.data.tags.map((tag) => <a href={`/notes/?tag=${encodeURIComponent(tag)}`}>{tag}</a>)}
    </div>
    <div class="prose">
      <Content />
    </div>
  </article>
</BaseLayout>

<style>
  .article {
    padding-block: 56px 24px;
  }

  h1 {
    margin: 0;
    font-size: clamp(2.1rem, 6vw, 4rem);
    line-height: 1.05;
  }

  .lede {
    margin: 18px 0 24px;
    color: var(--muted);
    font-size: 1.15rem;
  }

  .hero-image {
    margin: 16px 0 22px;
    border-radius: 8px;
  }

  .meta-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 30px;
  }

  .meta-tags a {
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 3px 9px;
    color: var(--muted);
    font-size: 0.86rem;
    text-decoration: none;
  }

  :global(.youtube-embed) {
    width: 100%;
    aspect-ratio: 16 / 9;
    border: 0;
    border-radius: 8px;
  }
</style>
```

- [ ] **Step 3: Create `src/pages/rss.xml.js`**

```js
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { site } from '../data/site';
import { publishedNotes, sortNotes } from '../lib/notes';

export async function GET(context) {
  const notes = sortNotes(publishedNotes(await getCollection('notes')));
  return rss({
    title: site.title,
    description: site.description,
    site: context.site,
    items: notes.map((note) => ({
      title: note.data.title,
      description: note.data.description,
      pubDate: note.data.date,
      link: `/notes/${note.slug}/`
    }))
  });
}
```

- [ ] **Step 4: Create `src/pages/sitemap.xml.js`**

```js
import { getCollection } from 'astro:content';
import { site } from '../data/site';
import { publishedNotes } from '../lib/notes';

export async function GET() {
  const notes = publishedNotes(await getCollection('notes'));
  const projects = await getCollection('projects');
  const urls = [
    '/',
    '/notes/',
    '/projects/',
    '/about/',
    ...notes.map((note) => `/notes/${note.slug}/`),
    ...projects.map((project) => `/projects/${project.slug}/`)
  ];

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
      .map((url) => `  <url><loc>${site.url}${url}</loc></url>`)
      .join('\n')}\n</urlset>`,
    { headers: { 'Content-Type': 'application/xml' } }
  );
}
```

- [ ] **Step 5: Create `src/pages/404.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Not found" description="The requested page could not be found.">
  <section class="content not-found">
    <p class="eyebrow">404</p>
    <h1>Page not found.</h1>
    <p>The page may have moved during the redesign. Start from the notes archive or projects index.</p>
    <p>
      <a class="button" href="/notes/">Browse notes</a>
      <a class="button secondary" href="/projects/">View projects</a>
    </p>
  </section>
</BaseLayout>

<style>
  .not-found {
    padding-block: 72px;
  }

  h1 {
    margin: 0;
    font-size: clamp(2.2rem, 8vw, 4.5rem);
  }

  p {
    color: var(--muted);
  }

  p:last-child {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
</style>
```

- [ ] **Step 6: Run build and inspect rendered note pages**

Run:

```bash
npm run build
```

Expected: Build fails only if project collection pages are referenced before project entries exist. If it fails on Markdown syntax, fix migration script or individual generated note content, then rerun.

- [ ] **Step 7: Commit note routes**

```bash
git add src/pages/notes src/pages/rss.xml.js src/pages/sitemap.xml.js src/pages/404.astro
git commit -m "feat: add note routes and feeds"
```

---

## Task 5: Add Project Content And Routes

**Files:**

- Create: `src/content/projects/labwired.md`
- Create: `src/content/projects/kernelcad.md`
- Create: `src/content/projects/uds.md`
- Create: `src/content/projects/iolink.md`
- Create: `src/components/ProjectCard.astro`
- Create: `src/layouts/ProjectLayout.astro`
- Create: `src/pages/projects/index.astro`
- Create: `src/pages/projects/[slug].astro`

- [ ] **Step 1: Create project content entries**

`src/content/projects/labwired.md`:

```md
---
name: Labwired
summary: Open tooling around laboratory and embedded workflows.
status: Active/open source
repoUrl: https://github.com/w1ne/labwired
topics:
  - embedded tooling
  - automation
  - developer workflow
proofPoints:
  - Turns repeated engineering workflows into maintainable tools.
  - Shows product thinking around developer experience.
  - Connects embedded work with practical automation.
featuredNotes: []
---

Labwired is a public project area for tools and experiments around laboratory, embedded, and development workflows.
```

`src/content/projects/kernelcad.md`:

```md
---
name: kernelCAD
summary: CAD and engineering tooling for practical product development.
status: Public project
repoUrl: https://github.com/w1ne/kernelCAD
topics:
  - CAD
  - engineering tools
  - product development
proofPoints:
  - Demonstrates interest in tools that bridge design and implementation.
  - Shows ability to shape engineering workflows into software.
  - Supports the broader product-builder identity.
featuredNotes: []
---

kernelCAD represents Andrii's work around CAD-oriented engineering tools and product-development workflows.
```

`src/content/projects/uds.md`:

```md
---
name: UDS
summary: Diagnostic communication work around Unified Diagnostic Services.
status: Public expertise area
topics:
  - diagnostics
  - embedded systems
  - automotive protocols
proofPoints:
  - Shows protocol-level embedded systems experience.
  - Connects firmware architecture with field diagnostics.
  - Demonstrates practical interest in maintainable device behavior.
featuredNotes: []
---

UDS is a featured expertise area for diagnostic communication in embedded and automotive-style systems.
```

`src/content/projects/iolink.md`:

```md
---
name: IO-Link
summary: Industrial device communication and productization experience.
status: Public expertise area
topics:
  - industrial IoT
  - device communication
  - firmware
proofPoints:
  - Highlights industrial communication experience.
  - Connects firmware work with real products and validation.
  - Supports credibility for embedded/IoT consulting.
featuredNotes: []
---

IO-Link is a featured expertise area for industrial device communication and connected product work.
```

- [ ] **Step 2: Create `src/components/ProjectCard.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';

interface Props {
  project: CollectionEntry<'projects'>;
}

const { project } = Astro.props;
---

<article class="project-card card">
  <p class="eyebrow">{project.data.status}</p>
  <h2><a href={`/projects/${project.slug}/`}>{project.data.name}</a></h2>
  <p>{project.data.summary}</p>
  <ul>
    {project.data.proofPoints.slice(0, 2).map((point) => <li>{point}</li>)}
  </ul>
</article>

<style>
  .project-card > * {
    margin-top: 0;
  }

  h2 {
    margin-bottom: 8px;
    font-size: 1.3rem;
  }

  h2 a {
    color: var(--text);
  }

  ul {
    padding-left: 20px;
    color: var(--muted);
  }
</style>
```

- [ ] **Step 3: Create `src/layouts/ProjectLayout.astro`**

```astro
---
import BaseLayout from './BaseLayout.astro';

interface Props {
  name: string;
  summary: string;
  status: string;
  repoUrl?: string;
  topics: string[];
  proofPoints: string[];
}
---

<BaseLayout title={Astro.props.name} description={Astro.props.summary}>
  <article class="content project">
    <p class="eyebrow">{Astro.props.status}</p>
    <h1>{Astro.props.name}</h1>
    <p class="lede">{Astro.props.summary}</p>
    <div class="actions">
      {Astro.props.repoUrl && <a class="button" href={Astro.props.repoUrl}>View repository</a>}
      <a class="button secondary" href="/projects/">All projects</a>
    </div>
    <section>
      <h2>What it demonstrates</h2>
      <ul>
        {Astro.props.proofPoints.map((point) => <li>{point}</li>)}
      </ul>
    </section>
    <section>
      <h2>Topics</h2>
      <div class="topics">
        {Astro.props.topics.map((topic) => <span>{topic}</span>)}
      </div>
    </section>
    <div class="prose">
      <slot />
    </div>
  </article>
</BaseLayout>

<style>
  .project {
    padding-block: 56px 24px;
  }

  h1 {
    margin: 0;
    font-size: clamp(2.2rem, 6vw, 4rem);
    line-height: 1.05;
  }

  .lede {
    color: var(--muted);
    font-size: 1.2rem;
  }

  .actions,
  .topics {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  section {
    margin-top: 36px;
  }

  .topics span {
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 4px 10px;
    color: var(--muted);
  }
</style>
```

- [ ] **Step 4: Create `src/pages/projects/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import ProjectCard from '../../components/ProjectCard.astro';

const projects = await getCollection('projects');
---

<BaseLayout title="Projects" description="Open-source project proof and embedded systems expertise.">
  <section class="content projects-head">
    <p class="eyebrow">Projects</p>
    <h1>Open-source proof and engineering focus areas.</h1>
    <p>Selected public work around embedded systems, engineering tools, diagnostics, and industrial device communication.</p>
  </section>
  <section class="container grid two projects-grid" aria-label="Projects">
    {projects.map((project) => <ProjectCard project={project} />)}
  </section>
</BaseLayout>

<style>
  .projects-head {
    padding-block: 56px 20px;
  }

  h1 {
    margin: 0;
    font-size: clamp(2.2rem, 6vw, 4rem);
    line-height: 1.05;
  }

  .projects-head p:not(.eyebrow) {
    color: var(--muted);
    font-size: 1.15rem;
  }

  .projects-grid {
    padding-block: 12px 32px;
  }
</style>
```

- [ ] **Step 5: Create `src/pages/projects/[slug].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import ProjectLayout from '../../layouts/ProjectLayout.astro';

export async function getStaticPaths() {
  const projects = await getCollection('projects');
  return projects.map((project) => ({ params: { slug: project.slug }, props: { project } }));
}

const { project } = Astro.props;
const { Content } = await render(project);
---

<ProjectLayout
  name={project.data.name}
  summary={project.data.summary}
  status={project.data.status}
  repoUrl={project.data.repoUrl}
  topics={project.data.topics}
  proofPoints={project.data.proofPoints}
>
  <Content />
</ProjectLayout>
```

- [ ] **Step 6: Build**

Run:

```bash
npm run build
```

Expected: `astro check` and `astro build` pass, or fail only on note markdown issues that must be fixed before committing.

- [ ] **Step 7: Commit project routes**

```bash
git add src/content/projects src/components/ProjectCard.astro src/layouts/ProjectLayout.astro src/pages/projects
git commit -m "feat: add project pages"
```

---

## Task 6: Add Homepage And About Page

**Files:**

- Create: `src/pages/index.astro`
- Create: `src/pages/about.astro`

- [ ] **Step 1: Create `src/pages/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import NoteCard from '../components/NoteCard.astro';
import ProjectCard from '../components/ProjectCard.astro';
import { site } from '../data/site';
import { featuredNotes } from '../lib/notes';

const notes = featuredNotes(await getCollection('notes'), 4);
const projects = await getCollection('projects');
---

<BaseLayout>
  <section class="hero container">
    <div class="hero-copy">
      <p class="eyebrow">Embedded systems and IoT architecture</p>
      <h1>Practical notes from building connected systems.</h1>
      <p>
        I write about firmware architecture, validation, industrial IoT, and productization from prototype to field.
      </p>
      <div class="actions">
        <a class="button" href={`mailto:${site.email}`}>Discuss a project</a>
        <a class="button secondary" href="/notes/">Read notes</a>
      </div>
    </div>
    <aside class="proof card" aria-label="Proof points">
      <h2>Useful for teams shipping connected products</h2>
      <ul>
        {site.proofPoints.map((point) => <li>{point}</li>)}
      </ul>
    </aside>
  </section>

  <section class="container section-block">
    <div class="section-head">
      <p class="eyebrow">Featured notes</p>
      <h2>Engineering judgment in public.</h2>
      <a href="/notes/">All notes</a>
    </div>
    <div class="grid two">
      {notes.map((note) => <NoteCard note={note} />)}
    </div>
  </section>

  <section class="container section-block">
    <div class="section-head">
      <p class="eyebrow">Project proof</p>
      <h2>Open-source work and focus areas.</h2>
      <a href="/projects/">All projects</a>
    </div>
    <div class="grid two">
      {projects.map((project) => <ProjectCard project={project} />)}
    </div>
  </section>

  <section class="container contact-band">
    <div>
      <p class="eyebrow">Contact</p>
      <h2>Working on embedded/IoT architecture or productization?</h2>
    </div>
    <a class="button" href={`mailto:${site.email}`}>Email Andrii</a>
  </section>
</BaseLayout>

<style>
  .hero {
    display: grid;
    gap: 28px;
    padding-block: 72px 42px;
  }

  @media (min-width: 860px) {
    .hero {
      grid-template-columns: minmax(0, 1.4fr) minmax(280px, 0.6fr);
      align-items: end;
    }
  }

  h1 {
    margin: 0;
    max-width: 780px;
    font-size: clamp(2.6rem, 8vw, 5.6rem);
    line-height: 0.98;
  }

  .hero-copy > p:not(.eyebrow) {
    max-width: 700px;
    color: var(--muted);
    font-size: 1.25rem;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 24px;
  }

  .proof h2 {
    margin-top: 0;
    font-size: 1.1rem;
  }

  .proof ul {
    margin-bottom: 0;
    padding-left: 20px;
    color: var(--muted);
  }

  .section-block {
    padding-block: 36px;
  }

  .section-head {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 18px;
  }

  .section-head h2 {
    margin: 0;
    font-size: clamp(1.8rem, 4vw, 2.6rem);
  }

  .contact-band {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    margin-top: 36px;
    padding: 24px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--surface);
  }

  .contact-band h2 {
    margin: 0;
    font-size: clamp(1.45rem, 4vw, 2.2rem);
  }

  @media (max-width: 700px) {
    .section-head,
    .contact-band {
      align-items: flex-start;
      flex-direction: column;
    }
  }
</style>
```

- [ ] **Step 2: Create `src/pages/about.astro`**

```astro
---
import ProseLayout from '../layouts/ProseLayout.astro';
import { site } from '../data/site';
---

<ProseLayout
  title="About"
  eyebrow="Andrii Shylenko"
  description="Embedded software engineer and independent consultant focused on connected products, firmware architecture, validation, and practical product development."
>
  <p>
    I help teams design, build, and validate firmware for connected products. My work sits between embedded software,
    industrial systems, architecture decisions, and the practical details that decide whether a product survives outside
    the lab.
  </p>

  <p>
    My background includes aircraft structural engineering, industrial automation, embedded software, IoT devices,
    locomotive interfaces, ultrasonic water meters, and independent consulting for companies building digital devices.
  </p>

  <h2>Work I am useful for</h2>
  <ul>
    <li>Firmware architecture for embedded and IoT products.</li>
    <li>Validation strategy from prototype through manufacturing readiness.</li>
    <li>Industrial communication, diagnostics, and connected-device behavior.</li>
    <li>Productization work where engineering choices need to survive real deployment.</li>
  </ul>

  <h2>Education</h2>
  <ul>
    <li>National Aerospace University KhAI, Master's degree in aircraft and helicopter structure and design.</li>
    <li>Opole University of Technology, Master's degree in control systems in automatics and robotics.</li>
  </ul>

  <h2>Contact</h2>
  <p>
    The best way to reach me is by email:
    <a href={`mailto:${site.email}`}>{site.email}</a>.
  </p>
  <p>
    You can also find me on <a href="https://github.com/w1ne">GitHub</a> and
    <a href="https://www.linkedin.com/in/andrewshylenko/">LinkedIn</a>.
  </p>
</ProseLayout>
```

- [ ] **Step 3: Build and preview**

Run:

```bash
npm run build
npm run preview -- --host 127.0.0.1
```

Expected:

- Build passes.
- Preview server starts and homepage, notes, projects, and about pages are navigable.

- [ ] **Step 4: Commit homepage and about page**

```bash
git add src/pages/index.astro src/pages/about.astro
git commit -m "feat: add homepage and about page"
```

---

## Task 7: Verify Redirects, Assets, And Legacy Compatibility

**Files:**

- Modify: generated files under `src/content/notes/`
- Modify: `scripts/migrate-posts.mjs` if conversion bugs are found.
- Modify: `src/styles/global.css` for migrated-content compatibility styles.

- [ ] **Step 1: Check for broken migrated syntax**

Run:

```bash
rg -n "\\{%|\\{\\{|featured-image|blogid|sticky|layout:" src/content/notes
```

Expected: no matches. If there are matches, update `scripts/migrate-posts.mjs`, rerun `npm run migrate:posts`, and inspect again.

- [ ] **Step 2: Add migrated-content compatibility styles to `src/styles/global.css`**

Append:

```css
.prose table {
  width: 100%;
  border-collapse: collapse;
  overflow-x: auto;
}

.prose th,
.prose td {
  border: 1px solid var(--border);
  padding: 8px 10px;
  text-align: left;
}

.prose blockquote {
  margin-inline: 0;
  border-left: 3px solid var(--border);
  padding-left: 16px;
  color: var(--muted);
}

.prose iframe {
  max-width: 100%;
}
```

- [ ] **Step 3: Build**

Run:

```bash
npm run build
```

Expected: build passes.

- [ ] **Step 4: Check representative output files**

Run:

```bash
test -f dist/index.html
test -f dist/notes/iot-loco-demo/index.html
test -f dist/projects/labwired/index.html
test -f dist/about/index.html
test -f dist/iot-train/index.html || test -f dist/iot-loco-demo/index.html
```

Expected: all commands exit `0`. If the old IoT URL output differs because of slug conversion, inspect `src/content/notes/iot-loco-demo.md` and generated redirect pages, then correct the legacy slug logic.

- [ ] **Step 5: Search built output for old Liquid tags**

Run:

```bash
rg -n "\\{%|\\{\\{" dist
```

Expected: no matches.

- [ ] **Step 6: Commit compatibility fixes**

```bash
git add src/styles/global.css src/content/notes scripts/migrate-posts.mjs src/pages
git commit -m "fix: verify migrated content compatibility"
```

---

## Task 8: Add GitHub Pages Deployment

**Files:**

- Create: `.github/workflows/deploy.yml`
- Verify: `CNAME`

- [ ] **Step 1: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy site

on:
  push:
    branches: [master]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Copy CNAME
        run: cp CNAME dist/CNAME
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Verify `CNAME`**

Run:

```bash
cat CNAME
```

Expected:

```text
shylenko.com
```

- [ ] **Step 3: Build locally**

Run:

```bash
npm run build
test "$(cat CNAME)" = "shylenko.com"
```

Expected: build passes and `CNAME` check exits `0`.

- [ ] **Step 4: Commit deployment workflow**

```bash
git add .github/workflows/deploy.yml CNAME
git commit -m "ci: deploy Astro site to GitHub Pages"
```

---

## Task 9: Final Local Verification

**Files:**

- Modify only files needed to fix final verification failures.

- [ ] **Step 1: Run full build**

Run:

```bash
npm run build
```

Expected: `astro check` and `astro build` pass.

- [ ] **Step 2: Start local preview**

Run:

```bash
npm run preview -- --host 127.0.0.1
```

Expected: preview server prints a local URL.

- [ ] **Step 3: Check key pages in browser or with curl**

Run, replacing the port if Astro chooses a different one:

```bash
curl -I http://127.0.0.1:4321/
curl -I http://127.0.0.1:4321/notes/
curl -I http://127.0.0.1:4321/projects/
curl -I http://127.0.0.1:4321/about/
```

Expected: each returns HTTP `200`.

- [ ] **Step 4: Check old URL redirects**

Run:

```bash
curl -s http://127.0.0.1:4321/iot-train/ | rg "Redirecting|notes"
curl -s http://127.0.0.1:4321/folder-structure-of-the-embedded-project/ | rg "Redirecting|notes"
```

Expected: each command finds redirect content that points to `/notes/`.

- [ ] **Step 5: Stop preview server**

Stop the running preview process with `Ctrl-C`.

- [ ] **Step 6: Commit final fixes if needed**

If final verification required changes, replace the file list with the exact files changed during verification:

```bash
git add src/styles/global.css src/content/notes scripts/migrate-posts.mjs src/pages
git commit -m "fix: complete Astro site verification"
```

If no changes were required, do not create an empty commit.

---

## Task 10: Cleanup Decision

**Files:**

- Potentially delete legacy Jekyll files after successful verification.

- [ ] **Step 1: List legacy files that Astro no longer uses**

Run:

```bash
git ls-files _config.yml _includes _layouts _sass style.scss index.html archive.html tag_index.html BooksNotes.html BadWriting.html about.md publickey.md search.json js
```

Expected: command lists legacy Jekyll files.

- [ ] **Step 2: Decide whether to remove legacy Jekyll files in this branch**

Default decision for first implementation: keep legacy files until the Astro site has been reviewed in preview. Do not delete them in the first pass unless they conflict with Astro output.

- [ ] **Step 3: Record cleanup status**

If legacy files are kept, add a short note to the final implementation summary:

```text
Legacy Jekyll files remain in the repo but are no longer part of the Astro build. They can be removed after the preview is approved.
```

If legacy files are removed after preview approval, run:

```bash
git rm -r _config.yml _includes _layouts _sass style.scss archive.html tag_index.html BooksNotes.html BadWriting.html search.json js
git rm index.html about.md publickey.md
git commit -m "chore: remove legacy Jekyll site"
```

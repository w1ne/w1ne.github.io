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
    .replace(/\.png""/g, '.png"')
    .replace(/\{\{\s*["']([^"']+)["']\s*\|\s*relative_url\s*\}\}/g, '$1')
    .replace(/\{\{\s*["']([^"']+)["']\s*\|\s*absolute_url\s*\}\}/g, '$1')
    .replace(/\{\%\s*include\s+youtube\.html\s+id=["']([^"']+)["']\s*\%\}/g, (_match, id) => {
      return `<iframe class="youtube-embed" src="https://www.youtube.com/embed/${id}" title="YouTube video" loading="lazy" allowfullscreen></iframe>`;
    })
    .replace(/\{\%\s*include\s+SelfEmployedCalculator\.html\s*\%\}/g, '> Legacy interactive calculator omitted during the Astro migration.')
    .replace(/\{\%\s*include\s+calculator_compounding\.html\s*\%\}/g, '> Legacy compounding calculator omitted during the Astro migration.')
    .replace(/\{\%\s*include\s+calcualtor_SPY_vs_Sell\.html\s*\%\}/g, '> Legacy options calculator omitted during the Astro migration.')
    .replace(/\)\{:\s*\.[^}]+\s*\}/g, ')')
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
    draft: false
  };
  if (parsed.data['featured-image']) {
    frontmatter.heroImage = `/images/img/${String(parsed.data['featured-image']).trim()}`;
  }

  const output = matter.stringify(`${body.trim()}\n`, frontmatter);
  await fs.writeFile(path.join(outputDir, `${slug}.md`), output);
}

console.log(`Migrated ${files.length} posts to ${path.relative(root, outputDir)}`);

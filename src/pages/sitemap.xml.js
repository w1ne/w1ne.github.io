import { getCollection } from 'astro:content';
import { site } from '../data/site';
import { allTags, publishedNotes } from '../lib/notes';

function xmlEscape(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

export async function GET() {
  const notes = publishedNotes(await getCollection('notes'));
  const projects = await getCollection('projects').catch(() => []);
  const urls = [
    '/',
    '/notes/',
    '/projects/',
    '/about/',
    ...notes.map((note) => `/notes/${note.slug}/`),
    ...allTags(notes).map((tag) => `/notes/tags/${encodeURIComponent(tag)}/`),
    ...projects.map((project) => `/projects/${project.slug}/`)
  ];

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
      .map((url) => `  <url><loc>${xmlEscape(`${site.url}${url}`)}</loc></url>`)
      .join('\n')}\n</urlset>`,
    { headers: { 'Content-Type': 'application/xml' } }
  );
}

import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { site } from '../data/site';
import { publishedNotes, sortNotes } from '../lib/notes';

export async function GET(context) {
  const notes = sortNotes(publishedNotes(await getCollection('notes')));

  return rss({
    title: site.title,
    description: site.description,
    site: context.site ?? site.url,
    items: notes.map((note) => ({
      title: note.data.title,
      description: note.data.description,
      pubDate: note.data.date,
      link: `/notes/${note.slug}/`
    }))
  });
}

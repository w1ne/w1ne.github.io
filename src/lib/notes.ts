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
  const tagsBySlug = new Map<string, string>();

  for (const tag of publishedNotes(notes)
    .flatMap((note) => note.data.tags)
    .sort((a, b) => a.localeCompare(b))) {
    if (!tagsBySlug.has(tagSlug(tag))) tagsBySlug.set(tagSlug(tag), tag);
  }

  return Array.from(tagsBySlug.values());
}

export function notesByTag(notes: Note[], tag: string): Note[] {
  const activeSlug = tagSlug(tag);
  return sortNotes(
    publishedNotes(notes).filter((note) => note.data.tags.some((noteTag) => tagSlug(noteTag) === activeSlug))
  );
}

export function tagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function tagPath(tag: string): string {
  return `/notes/tags/${tagSlug(tag)}/`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC'
  }).format(date);
}

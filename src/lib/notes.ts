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

export function tagPath(tag: string): string {
  return `/notes/tags/${encodeURIComponent(tag)}/`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC'
  }).format(date);
}

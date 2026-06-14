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
    image: z.string().optional(),
    order: z.number().optional(),
    topics: z.array(z.string()).default([]),
    proofPoints: z.array(z.string()).default([]),
    featuredNotes: z.array(z.string()).default([])
  })
});

export const collections = { notes, projects };

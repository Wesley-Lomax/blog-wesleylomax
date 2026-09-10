import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Posts keep their original file names (date-prefixed slugs) so the
// canonical URL /posts/<slug>/ is preserved exactly from the old site.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    featuredimage: z.string().optional(),
    featuredpost: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    categories: z.array(z.string()).default([]),
    author: z.string().default('Wesley Lomax'),
  }),
});

export const collections = { blog };

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogs = defineCollection({
  // Load Markdown files in the src/content/blogs directory.
  loader: glob({ base: './src/content', pattern: '**/*.md' }),
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      author: z.string().optional(),
      tags: z.array(z.string()).optional(),
      oss: z.string().optional(),
      image: z.object({
        url: z.string(),
        src: image(),
      }).optional(),
      // Transform string to Date object
      date: z.date({ coerce: true }).optional(),
    }),
});

export const collections = { blogs };

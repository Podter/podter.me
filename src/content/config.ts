import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      cover: image().optional(),
      date: z
        .string()
        .or(z.date())
        .transform((val) => new Date(val)),
    }),
});

export const collections = { blog };

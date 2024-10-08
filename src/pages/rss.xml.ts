import type { APIRoute } from "astro";
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

import { DESCRIPTION, NAME } from "~/constants/metadata";

export const GET: APIRoute = async ({ site }) => {
  const posts = await getCollection("blog");
  return rss({
    title: NAME,
    description: DESCRIPTION,
    site: site ?? "",
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      link: `/blog/${post.slug}/`,
      pubDate: post.data.date,
    })),
  });
};

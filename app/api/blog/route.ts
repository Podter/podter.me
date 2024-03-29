import type { Posts } from "~/lib/schema";
import { getBlogPosts } from "~/lib/blog";

export const dynamic = "force-static";

export async function GET() {
  const rawPosts = getBlogPosts();

  return Response.json({
    posts: rawPosts.map((post) => ({
      title: post.metadata.title,
      url: post.url,
    })),
  } as Posts);
}

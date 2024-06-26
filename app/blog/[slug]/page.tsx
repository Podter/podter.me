import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns/format";
import pwsh from "highlight.js/lib/languages/powershell";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import SplitAnimate from "~/components/split-animate";
import { H1 } from "~/components/ui/typography";
import { getBlogPosts } from "~/lib/blog";
import { createMetadata } from "~/lib/create-metadata";
import { mdxComponents } from "~/lib/mdx";
import Image from "./image";
import PreformattedText from "./preformatted-text";

import "./blog.scss";

export const dynamic = "force-static";
export const dynamicParams = false;

export interface PageParams {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export function generateMetadata({ params }: PageParams): Metadata | undefined {
  const post = getBlogPosts().find((post) => post.slug === params.slug);
  if (!post) {
    return;
  }

  const date = format(post.date, "d MMMM yyyy");

  return createMetadata({
    title: post.metadata.title,
    description: post.metadata.description,
    publishedTime: date,
  });
}

export default async function Blog({ params }: PageParams) {
  const post = getBlogPosts().find((post) => post.slug === params.slug);
  if (!post) {
    return notFound();
  }

  const { content } = await compileMDX({
    source: post.content,
    components: { ...mdxComponents, pre: PreformattedText, Image },
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            // @ts-expect-error types are wrong
            rehypeHighlight,
            {
              languages: { pwsh },
            },
          ],
          [
            rehypeAutolinkHeadings,
            {
              behavior: "wrap",
              test: ["h2", "h3"],
              properties: {
                "data-rehype-autolink-headings": true,
              },
            },
          ],
        ],
        format: "mdx",
      },
    },
  });

  const date = format(post.date, "do MMMM, yyyy");

  return (
    <>
      <div className="flex flex-col">
        <SplitAnimate as={H1}>{post.metadata.title}</SplitAnimate>
        <div className="mt-3 flex items-center gap-1 text-muted-foreground">
          <CalendarIcon className="h-3.5 w-3.5" width={14} height={14} />
          <p className="text-sm">Published on {date}</p>
        </div>
      </div>
      <article className="mt-6">{content}</article>
    </>
  );
}

"use client";

import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import { FadeIn } from "@/components/ui/motion-primitives";
import SplitText from "@/components/ui/split-text";
import { BLOG_POSTS, type BlogPost } from "@/lib/blog-data";

export function BlogList(): ReactNode {
  return (
    <section className="relative w-full [font-family:var(--font-poppins)]">
      <div className="mx-auto w-full px-6 sm:px-24">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {BLOG_POSTS.map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogCard({
  post,
  index,
}: {
  post: BlogPost;
  index: number;
}): ReactNode {
  const Icon = post.icon;
  return (
    <FadeIn delay={Math.min(index * 0.06, 0.3)} className="flex h-full">
      <Link
        href={post.isKeyword ? `/${post.slug}` : `/blog/${post.slug}`}
        className="group flex w-full"
      >
        <article className="border-foreground/8 bg-background hover:border-foreground/20 flex w-full flex-col gap-4 rounded-3xl border p-3 transition-all duration-300 hover:shadow-lg sm:p-3.5">
          <header className="flex items-center gap-2.5 px-1 pt-2">
            <span className="border-foreground/10 bg-background inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border">
              <Icon
                className="text-foreground h-3.5 w-3.5"
                aria-hidden="true"
              />
            </span>
            <span className="text-foreground text-sm font-medium tracking-tight">
              {post.category}
            </span>
          </header>

          <div className="ring-foreground/5 bg-foreground/5 relative aspect-video w-full overflow-hidden rounded-2xl ring-1">
            <div className="h-full w-full overflow-hidden">
              <Image
                src={post.image}
                alt={post.imageAlt}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 45vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority={index < 3}
              />
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-2.5 px-1 pb-1">
            <h3 className="text-foreground group-hover:text-primary font-serif text-[20px] leading-[1.2] font-medium tracking-tight transition-colors sm:text-[22px]">
              <SplitText
                text={post.title}
                tag="span"
                className="[font-family:var(--font-gohan)] tracking-wider"
                textAlign="left"
                delay={20}
                duration={0.6}
                ease="power3.out"
                splitType="words"
                from={{ opacity: 0, y: 20 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-20px"
              />
            </h3>
            <p className="text-foreground/65 line-clamp-3 text-[14px] leading-normal tracking-tight sm:text-[15px]">
              {post.excerpt}
            </p>
          </div>

          <div className="border-foreground/5 mt-auto flex items-center justify-between border-t px-1 pt-3 pb-1">
            <span className="text-foreground/50 text-[12px] tracking-tight">
              {post.date}
            </span>
            <span className="text-foreground flex items-center gap-1 text-[12px] font-medium transition-transform group-hover:translate-x-1">
              Ler mais
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </article>
      </Link>
    </FadeIn>
  );
}

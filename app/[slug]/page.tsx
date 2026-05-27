import { ContactCard } from "@/components/contact/contact-card";
import { BLOG_POSTS } from "@/lib/blog-data";
import { FadeIn } from "@/components/ui/motion-primitives";
import SplitText from "@/components/ui/split-text";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return BLOG_POSTS.filter((post) => post.isKeyword).map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post || !post.isKeyword) {
    return createMetadata({
      title: "Página não encontrada",
      path: "/",
    });
  }

  return createMetadata({
    title: `${post.title} | Market Gru`,
    description: post.excerpt,
    path: `/${slug}`,
  });
}

export default async function KeywordPage({
  params,
}: Props): Promise<ReactNode> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  // Se não for uma palavra-chave ou não existir, 404
  if (!post || !post.isKeyword) {
    notFound();
  }

  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <section className="mx-auto w-full max-w-7xl px-6 pt-44 pb-16">
        <FadeIn className="mb-8">
          <Link
            href="/blog"
            className="text-foreground/60 hover:text-foreground inline-flex items-center gap-2 [font-family:var(--font-poppins)] text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Blog
          </Link>
        </FadeIn>

        <FadeIn className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <span className="bg-foreground/5 text-foreground rounded-full px-3 py-1 [font-family:var(--font-poppins)] text-xs font-medium">
              {post.category}
            </span>
          </div>

          <h1 className="text-foreground font-serif text-[2.5rem] leading-[1.1] font-medium tracking-tight md:text-[3.5rem]">
            <SplitText
              text={post.title}
              tag="span"
              className="[font-family:var(--font-gohan)] tracking-wider"
              textAlign="left"
              delay={25}
              duration={0.8}
              ease="power3.out"
              splitType="words"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-50px"
            />
          </h1>

          <p className="text-foreground/70 [font-family:var(--font-poppins)] text-xl leading-relaxed italic">
            {post.excerpt}
          </p>

          <div className="ring-foreground/5 bg-foreground/5 relative mt-8 aspect-video w-full overflow-hidden rounded-3xl ring-1">
            <Image
              src={post.image}
              alt={post.imageAlt}
              fill
              className="object-cover"
              priority
            />
          </div>

          <article className="mt-12">
            <div
              className="blog-rich-text text-foreground/80 text-lg"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>
        </FadeIn>
      </section>

      <ContactCard />
      <div className="h-12 sm:h-16" />
    </main>
  );
}

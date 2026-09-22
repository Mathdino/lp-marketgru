import { ContactCard } from "@/components/contact/contact-card";
import { AtuacaoView } from "@/components/atuacao/atuacao-view";
import { JsonLd } from "@/components/seo/json-ld";
import { BLOG_POSTS } from "@/lib/blog-data";
import { ATUACAO_AREAS, getAtuacaoArea } from "@/lib/atuacao-data";
import { FadeIn } from "@/components/ui/motion-primitives";
import SplitText from "@/components/ui/split-text";
import { createMetadata } from "@/lib/metadata";
import {
  montarGrafo,
  schemaArticle,
  schemaBreadcrumb,
  schemaFaq,
  schemaService,
  schemaWebPage,
} from "@/lib/schema";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

/* =============================================================================
   DISPATCHER DE RAIZ — /{slug}

   Duas famílias de página vivem aqui, na ordem de resolução:
     1. ÁREA DE ATUAÇÃO  (lib/atuacao-data.ts)  — hub, schema Service + FAQPage
     2. PÁGINA DE KEYWORD (lib/blog-data.ts, isKeyword) — cauda longa, Article

   É o padrão "dispatcher + array" do guia TIER: criar página = adicionar 1
   entrada no array. Nenhum arquivo de rota novo, nenhum sitemap editado à mão.

   Slug que não casa com nenhuma das duas tabelas = notFound() de verdade.
   Página 200 com conteúdo vazio é soft 404 e queima rastreio.
   ========================================================================== */

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return [
    ...ATUACAO_AREAS.map((area) => ({ slug: area.slug })),
    ...BLOG_POSTS.filter((post) => post.isKeyword).map((post) => ({
      slug: post.slug,
    })),
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const area = getAtuacaoArea(slug);
  if (area) {
    return createMetadata({
      title: area.metaTitle,
      description: area.metaDescription,
      path: `/${slug}`,
      image: area.imagem,
    });
  }

  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post || !post.isKeyword) {
    // Slug inexistente: o metadata não pode anunciar página que vai dar 404.
    return createMetadata({ title: "Página não encontrada", path: `/${slug}`, noIndex: true });
  }

  return createMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/${slug}`,
    image: post.image,
  });
}

export default async function SlugPage({ params }: Props): Promise<ReactNode> {
  const { slug } = await params;

  /* ── 1. Área de atuação ────────────────────────────────────────────────── */
  const area = getAtuacaoArea(slug);
  if (area) {
    const canonical = `/${slug}`;
    const grafo = montarGrafo([
      schemaWebPage({
        canonical,
        nome: area.h1,
        descricao: area.metaDescription,
        imagem: area.imagem,
      }),
      schemaBreadcrumb(
        [
          { nome: "Atuação", path: "/atuacao" },
          { nome: area.label, path: canonical },
        ],
        canonical
      ),
      schemaService({
        canonical,
        nome: area.h1,
        descricao: area.resumo,
        audiencia: area.audiencia,
      }),
      schemaFaq(area.faq, canonical),
    ]);

    return (
      <>
        <JsonLd data={grafo} />
        <AtuacaoView area={area} />
      </>
    );
  }

  /* ── 2. Página de keyword (cauda longa) ────────────────────────────────── */
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post || !post.isKeyword) {
    notFound();
  }

  const canonical = `/${slug}`;
  const grafo = montarGrafo([
    schemaWebPage({
      canonical,
      nome: post.title,
      descricao: post.excerpt,
      imagem: post.image,
    }),
    schemaBreadcrumb([{ nome: post.title, path: canonical }], canonical),
    schemaArticle({
      canonical,
      titulo: post.title,
      descricao: post.excerpt,
      imagem: post.image,
      publicado: post.date,
    }),
  ]);

  return (
    <>
      <JsonLd data={grafo} />
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
                sizes="(min-width: 1280px) 1216px, 100vw"
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
    </>
  );
}

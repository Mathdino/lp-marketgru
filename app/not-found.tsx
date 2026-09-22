import { ArrowRight, Home, MessageCircle, Newspaper, Store } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { FadeIn } from "@/components/ui/motion-primitives";
import { ATUACAO_AREAS } from "@/lib/atuacao-data";
import { createMetadata } from "@/lib/metadata";

/* =============================================================================
   PÁGINA 404

   No App Router este arquivo é a página de "não encontrado" do site inteiro.
   Ele responde a duas situações, sem precisar de rota própria:

     1. URL que não casa com nenhuma rota  (/qualquer/coisa)
     2. Rota que decide não existir chamando notFound() — é o caso de
        app/[slug]/page.tsx, que dá 404 em slug fora de atuacao-data/blog-data

   IMPORTANTE, e o motivo de NÃO existir uma rota /404 com redirect para ela:
   este arquivo é servido com HTTP 404 na própria URL errada. Redirecionar para
   uma página /404 devolveria 301 + 200, ou seja, o buscador entenderia que a
   URL quebrada é uma página válida (soft 404) e a manteria no índice. Do jeito
   atual o visitante vê a página com a cara do site E o buscador recebe o
   código certo.

   SOBRE O FUNDO: esta página tem fundo sólido próprio (bg-background), que
   cobre o shader desenhado pelo layout no topo de todas as páginas. As demais
   páginas convivem com o shader porque o texto delas começa abaixo dele; aqui o
   conteúdo é curto e caía bem em cima — a borda do shader cortava os cards ao
   meio e, no tema claro, texto escuro ficava sobre fundo escuro. Fundo sólido
   resolve os dois casos e mantém o mesmo contraste nos dois temas.
   ========================================================================== */

export const metadata: Metadata = createMetadata({
  title: "Página não encontrada",
  description:
    "A página que você procura não existe ou foi movida. Veja os atalhos para as principais páginas da MarketGRU.",
  path: "/404",
  noIndex: true,
});

/* Atalhos em vez de beco sem saída: quem caiu aqui veio de um link velho, de
   um endereço digitado errado ou de um resultado de busca desatualizado. */
const ATALHOS = [
  {
    href: "/",
    label: "Início",
    descricao: "A home da MarketGRU",
    icon: Home,
  },
  {
    href: "/minimercado",
    label: "Minimercado",
    descricao: "Como funciona o mercado autônomo",
    icon: Store,
  },
  {
    href: "/blog",
    label: "Blog",
    descricao: "Conteúdo para síndicos e empresas",
    icon: Newspaper,
  },
  {
    href: "/contato",
    label: "Contato",
    descricao: "Fale com a gente e agende a visita",
    icon: MessageCircle,
  },
] as const;

export default function NotFound(): ReactNode {
  return (
    <main
      id="main-content"
      /* bg-background tampa o shader do layout — ver comentário no topo.
         min-h evita a faixa de fundo sobrando entre o conteúdo e o rodapé,
         já que esta página é curta. */
      className="bg-background relative z-0 flex min-h-[calc(100svh-5rem)] w-full flex-col items-center"
    >
      <section className="mx-auto w-full max-w-3xl px-6 pt-40 pb-20 sm:px-10">
        <FadeIn className="flex flex-col items-center gap-5 text-center">
          {/* O acento já troca por tema no globals.css: fechado no claro
              (#d9260f, passa no AA sobre branco), aberto no escuro (#ff5a41). */}
          <span
            aria-hidden="true"
            className="text-[var(--mg-accent)] [font-family:var(--font-gohan)] text-[5rem] leading-none tracking-wider sm:text-[7rem]"
          >
            404
          </span>

          {/* Sem SplitText aqui de propósito: ele fatia o texto dentro de um
              contêiner com overflow hidden medido em uma linha, e este título
              quebra em duas no celular — a segunda linha sumia. Página de erro
              é a última que pode se dar ao luxo de esconder o próprio texto. */}
          <h1 className="text-foreground [font-family:var(--font-gohan)] text-[1.75rem] leading-[1.15] font-medium tracking-wider sm:text-[2.25rem] lg:text-[2.75rem]">
            Esta página não existe
          </h1>

          <p className="text-foreground/70 max-w-xl [font-family:var(--font-poppins)] text-[17px] leading-[1.5] tracking-tight sm:text-[19px]">
            O endereço pode ter mudado de lugar ou ter sido digitado com algum
            caractere a mais. Abaixo estão os caminhos mais usados.
          </p>

          <Link
            href="/"
            className="bg-foreground text-background focus-ring group mt-2 inline-flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 [font-family:var(--font-poppins)] text-sm font-medium transition-opacity hover:opacity-90"
          >
            Voltar para o início
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </FadeIn>

        <FadeIn delay={0.12} className="mt-14">
          <nav aria-label="Atalhos do site">
            <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2">
              {ATALHOS.map((atalho) => {
                const Icone = atalho.icon;
                return (
                  <li key={atalho.href}>
                    {/* Superfície derivada do foreground: cinza-claro no tema
                        claro, cinza-escuro no escuro, sem cor fixa nenhuma. */}
                    <Link
                      href={atalho.href}
                      className="border-foreground/10 hover:border-foreground/30 bg-foreground/[0.04] hover:bg-foreground/[0.07] focus-ring flex h-full items-center gap-3 rounded-2xl border p-4 transition-colors"
                    >
                      <span
                        aria-hidden="true"
                        className="bg-foreground/[0.07] grid h-10 w-10 shrink-0 place-items-center rounded-xl text-[var(--mg-accent)]"
                      >
                        <Icone className="h-[18px] w-[18px]" />
                      </span>
                      <span className="flex flex-col leading-tight">
                        <span className="text-foreground [font-family:var(--font-poppins)] text-[15px] font-semibold">
                          {atalho.label}
                        </span>
                        <span className="text-foreground/60 [font-family:var(--font-poppins)] text-[13px]">
                          {atalho.descricao}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </FadeIn>

        {/* As áreas de atuação saem do MESMO array que gera as páginas: área
            nova aparece aqui sozinha, sem lista paralela para desatualizar. */}
        <FadeIn delay={0.2} className="mt-10 text-center">
          <p className="text-foreground/50 [font-family:var(--font-poppins)] text-[12px] tracking-[0.12em] uppercase">
            Onde a MarketGRU atua
          </p>
          <ul className="m-0 mt-3 flex list-none flex-wrap items-center justify-center gap-2 p-0">
            {ATUACAO_AREAS.map((area) => (
              <li key={area.slug}>
                <Link
                  href={`/${area.slug}`}
                  className="border-foreground/15 text-foreground/80 hover:border-foreground/35 hover:text-foreground focus-ring inline-flex items-center rounded-full border px-4 py-1.5 [font-family:var(--font-poppins)] text-[14px] font-medium transition-colors"
                >
                  {area.label}
                </Link>
              </li>
            ))}
          </ul>
        </FadeIn>
      </section>
    </main>
  );
}

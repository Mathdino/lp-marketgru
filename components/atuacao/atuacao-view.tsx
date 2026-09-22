import {
  ArrowUpRight,
  BookOpen,
  Check,
  Footprints,
  Scale,
  ScanSearch,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { CardSpotlight } from "@/components/atuacao/card-spotlight";
import { CartoesModelo } from "@/components/atuacao/cartoes-modelo";
import { ContadorNumeros } from "@/components/atuacao/contador-numeros";
import { HeroAtuacao } from "@/components/atuacao/hero-atuacao";
import { LinhaPassos } from "@/components/atuacao/linha-passos";
import { TabelaAtuacao } from "@/components/atuacao/tabela-atuacao";
import { ContactCard } from "@/components/contact/contact-card";
import { FaqAccordion } from "@/components/faq/faq-accordion";
import { GsapReveal } from "@/components/ui/gsap-reveal";
import { SeloSecao } from "@/components/ui/selo-secao";
import type { AtuacaoArea } from "@/lib/atuacao-data";

/* =============================================================================
   VIEW DE ÁREA DE ATUAÇÃO — compartilhada pelas duas (e pelas próximas).

   É a "tier-view" do guia adaptada ao Next: um só template, alimentado pelo
   array. Criar uma área nova não passa por aqui — passa por uma entrada em
   lib/atuacao-data.ts.

   Ordem dos blocos, e o porquê de cada posição:
     1. Topo com trilha, H1 e resposta direta (answer-first) + a foto
     2. Números concretos, com contagem — é o que motor generativo cita
     3. Conteúdo em H2/H3, cada tipo de bloco com o seu desenho
     4. FAQ visível (o mesmo array que vira FAQPage)
     5. Páginas relacionadas (pirâmide de autoridade)
     6. Formulário de contato

   Tipografia: Gohan em título, Poppins em texto corrido — as duas declaradas
   no elemento, porque herdar de <body> deixa qualquer bloco novo à deriva.
   ========================================================================== */

/** Título de seção: mesmo desenho em todos os blocos, um lugar só para mexer. */
function TituloSecao({
  children,
  sobre,
  icone,
}: {
  children: ReactNode;
  sobre?: string;
  icone?: LucideIcon;
}): ReactNode {
  return (
    <>
      {sobre && icone && <SeloSecao icone={icone}>{sobre}</SeloSecao>}
      <h2 className="text-foreground [font-family:var(--font-gohan)] text-2xl leading-tight tracking-wide sm:text-[2rem]">
        {children}
      </h2>
    </>
  );
}

export function AtuacaoView({ area }: { area: AtuacaoArea }): ReactNode {
  const Icone = area.icon;

  /* Os chips da foto saem dos MESMOS números da faixa: dois fatos, não frase
     de efeito, e nada para manter em dois lugares. */
  const chips = area.numeros.slice(0, 2).map((n) => ({
    valor: n.valor,
    rotulo: n.rotulo,
  }));

  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <HeroAtuacao
        trilha={[
          { label: "Início", href: "/" },
          { label: "Atuação", href: "/atuacao" },
          { label: area.label },
        ]}
        selo="Área de atuação"
        icone={<Icone className="h-4 w-4" />}
        titulo={area.h1}
        resumo={area.resumo}
        imagem={area.imagem}
        imagemAlt={area.imagemAlt}
        chips={chips}
        acaoPrimaria={{ label: "Agendar visita técnica", href: "/contato" }}
        acaoSecundaria={{
          label: "Comparar com o outro segmento",
          href: "/atuacao",
        }}
      />

      {/* ── Números ─────────────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-6 py-8">
        <h2 className="sr-only">Números de {area.label.toLowerCase()}</h2>
        <ContadorNumeros numeros={area.numeros} />
      </section>

      {/* ── Conteúdo ────────────────────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-6xl px-6">
        {area.blocos.map((bloco, i) => (
          <section key={`${bloco.tipo}-${i}`} className="py-12 sm:py-16">
            {bloco.tipo === "texto" && (
              <GsapReveal seletorFilhos="[data-rev]" saida>
                <div data-rev>
                  <TituloSecao>{bloco.titulo}</TituloSecao>
                </div>
                {/* Coluna de leitura curta e um filete de acento à esquerda:
                    linha longa demais é o que faz o leitor desistir no meio. */}
                <div className="mt-6 flex flex-col gap-4">
                  {bloco.paragrafos.map((p, pi) => (
                    <p
                      key={pi}
                      data-rev
                      className="text-foreground/75 [font-family:var(--font-poppins)] text-[17px] leading-relaxed"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </GsapReveal>
            )}

            {bloco.tipo === "lista" && (
              <>
                <TituloSecao
                  sobre={bloco.selo ?? "Em detalhe"}
                  icone={bloco.seloIcone ?? ScanSearch}
                >
                  {bloco.titulo}
                </TituloSecao>
                {bloco.intro && (
                  <p className="text-foreground/65 mt-4 [font-family:var(--font-poppins)] text-[17px] leading-relaxed">
                    {bloco.intro}
                  </p>
                )}
                {/* Todos os itens com foto → cartões ilustrados. Basta uma
                    entrada do array ganhar `imagem` para o bloco mudar de
                    formato; nenhum arquivo de rota ou de view precisa mudar. */}
                {bloco.itens.every((item) => item.imagem) ? (
                  <GsapReveal saida className="mt-8">
                    <CartoesModelo
                      modelos={bloco.itens.map((item) => ({
                        titulo: item.titulo,
                        texto: item.texto,
                        imagem: item.imagem as string,
                        imagemAlt: item.imagemAlt ?? item.titulo,
                      }))}
                    />
                  </GsapReveal>
                ) : (
                  <GsapReveal
                    as="ul"
                    seletorFilhos="li"
                    saida
                    className="mt-8 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2"
                  >
                    {bloco.itens.map((item, ii) => (
                      <li key={item.titulo} className="h-full">
                        <CardSpotlight className="border-foreground/12 hover:border-foreground/30 bg-foreground/[0.02] flex h-full flex-col rounded-3xl border p-6 transition-colors duration-300">
                          <span className="mb-4 flex items-center justify-between">
                            <span
                              aria-hidden="true"
                              className="grid h-9 w-9 place-items-center rounded-xl text-[var(--mg-accent)]"
                              style={{
                                background:
                                  "color-mix(in oklab, var(--mg-accent) 12%, transparent)",
                              }}
                            >
                              <Check className="h-[18px] w-[18px]" />
                            </span>
                            <span className="text-foreground/40 [font-family:var(--font-gohan)] text-[13px] tracking-widest">
                              {String(ii + 1).padStart(2, "0")}
                            </span>
                          </span>
                          <h3 className="text-foreground [font-family:var(--font-poppins)] text-[17px] leading-snug font-semibold">
                            {item.titulo}
                          </h3>
                          <p className="text-foreground/65 mt-2 [font-family:var(--font-poppins)] text-[15px] leading-relaxed">
                            {item.texto}
                          </p>
                        </CardSpotlight>
                      </li>
                    ))}
                  </GsapReveal>
                )}
              </>
            )}

            {bloco.tipo === "passos" && (
              <>
                <TituloSecao sobre="Passo a passo" icone={Footprints}>
                  {bloco.titulo}
                </TituloSecao>
                {bloco.intro && (
                  <p className="text-foreground/65 mt-4 [font-family:var(--font-poppins)] text-[17px] leading-relaxed">
                    {bloco.intro}
                  </p>
                )}
                <div className="mt-8 rounded-3xl px-6 py-8 sm:px-10">
                  <LinhaPassos passos={bloco.passos} />
                </div>
              </>
            )}

            {bloco.tipo === "tabela" && (
              <>
                <TituloSecao sobre="Comparativo" icone={Scale}>
                  {bloco.titulo}
                </TituloSecao>
                {bloco.intro && (
                  <p className="text-foreground/65 mt-4 [font-family:var(--font-poppins)] text-[17px] leading-relaxed">
                    {bloco.intro}
                  </p>
                )}
                <GsapReveal saida>
                  <TabelaAtuacao
                    legenda={bloco.legenda}
                    colunas={bloco.colunas}
                    linhas={bloco.linhas}
                  />
                </GsapReveal>
              </>
            )}
          </section>
        ))}
      </div>

      {/* ── FAQ visível — mesmo array que alimenta o FAQPage ────────────── */}
      <FaqAccordion
        itens={area.faq}
        titulo={`Perguntas frequentes — ${area.label.toLowerCase()}`}
        intro="As dúvidas que mais aparecem antes de fechar. Se a sua não estiver aqui, mande pelo formulário abaixo."
        id={`faq-${area.slug}`}
      />

      {/* ── Relacionados — pirâmide de autoridade ───────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-6 py-14">
        <TituloSecao sobre="Continue" icone={BookOpen}>
          Leituras relacionadas
        </TituloSecao>
        <GsapReveal
          as="ul"
          seletorFilhos="li"
          className="mt-6 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3"
        >
          {area.relacionados.map((r) => (
            <li key={r.href}>
              <Link
                href={r.href}
                className="border-foreground/12 hover:border-foreground/30 hover:bg-foreground/[0.03] focus-ring group flex h-full items-center justify-between gap-4 rounded-2xl border px-5 py-4 transition-colors duration-300"
              >
                <span className="text-foreground/85 [font-family:var(--font-poppins)] text-[15px] leading-snug font-medium">
                  {r.titulo}
                </span>
                <ArrowUpRight
                  className="text-foreground/35 h-4 w-4 shrink-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--mg-accent)]"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </GsapReveal>
      </section>

      <ContactCard />
      <div className="h-12 sm:h-16" />
    </main>
  );
}

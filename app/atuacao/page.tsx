import { ArrowUpRight, Columns2, MapPin, Scale, Truck } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { CardSpotlight } from "@/components/atuacao/card-spotlight";
import { ComparativoVersus } from "@/components/atuacao/comparativo-versus";
import { ContadorNumeros } from "@/components/atuacao/contador-numeros";
import { HeroAtuacao } from "@/components/atuacao/hero-atuacao";
import { RaioCobertura } from "@/components/atuacao/raio-cobertura";
import { ContactCard } from "@/components/contact/contact-card";
import { FaqAccordion } from "@/components/faq/faq-accordion";
import { JsonLd } from "@/components/seo/json-ld";
import { GsapReveal } from "@/components/ui/gsap-reveal";
import { SeloSecao } from "@/components/ui/selo-secao";
import { ATUACAO_AREAS } from "@/lib/atuacao-data";
import { createMetadata } from "@/lib/metadata";
import {
  montarGrafo,
  schemaBreadcrumb,
  schemaCollection,
  schemaFaq,
  schemaWebPage,
} from "@/lib/schema";

/* =============================================================================
   HUB DE ATUAÇÃO — /atuacao

   Página de listagem no padrão TIER: CollectionPage + ItemList com o que está
   NA TELA desta página (as 2 áreas), nunca com as 14 páginas de cauda longa
   que existem no site. ItemList que não bate com a tela é schema inválido na
   prática, mesmo passando no validador.

   O conteúdo próprio da página é o comparativo — o recorte que nenhuma das duas
   páginas-filhas pode fazer sozinha, e que justifica a existência do hub. Hub
   que só repete um resumo das filhas é página fina.
   ========================================================================== */

const CANONICAL = "/atuacao";

const META_DESCRIPTION =
  "Onde a MarketGRU atua: mercados autônomos para condomínios e para empresas em São Paulo, instalados sem custo, com mix e operação definidos por segmento.";

export const metadata: Metadata = createMetadata({
  title: "Atuação: mercados para condomínios e empresas",
  description: META_DESCRIPTION,
  path: CANONICAL,
});

const RESUMO =
  "A MarketGRU instala e opera mercados autônomos em dois ambientes: condomínios residenciais e empresas. Em ambos a implantação é sem custo para o contratante — o que muda entre eles é o mix, o horário de pico e quem decide a contratação.";

const NUMEROS = [
  { valor: "2", rotulo: "segmentos atendidos" },
  { valor: "24h", rotulo: "operação sem operador" },
  { valor: "R$ 0", rotulo: "de implantação nos dois" },
  { valor: "SP", rotulo: "estado de cobertura atual" },
];

const CIDADES = [
  "São Paulo",
  "Guarulhos",
  "Osasco",
  "Santo André",
  "São Bernardo",
  "Barueri",
  "Cotia",
  "Região metropolitana",
];

const FAQ = [
  {
    q: "Qual a diferença entre o mercado de condomínio e o de empresa?",
    a: "O modelo comercial é o mesmo — implantação sem custo, operação nossa. O que muda é o conteúdo: em condomínio o mix é de reposição doméstica (leite, pão, higiene) e o pico é noturno; em empresa é de consumo imediato (café, snack, refeição pronta) e o pico acompanha as viradas de turno. A decisão também muda de mão: síndico ou assembleia de um lado, facilities ou RH do outro.",
  },
  {
    q: "A MarketGRU atende fora de São Paulo?",
    a: "Hoje a operação própria cobre São Paulo e região metropolitana, porque reposição e manutenção dependem de logística própria. Para outras praças, avaliamos caso a caso conforme o volume — vale mandar a localização pelo formulário que respondemos com uma posição honesta sobre prazo.",
  },
  {
    q: "Condomínio misto, com torre residencial e comercial, entra em qual modelo?",
    a: "Normalmente no residencial, com mix ajustado. Em empreendimento de uso misto a visita técnica mede a proporção de moradores e de trabalhadores e define o mix a partir disso, em vez de aplicar um dos dois padrões de prateleira.",
  },
  {
    q: "Existe tamanho mínimo para instalar?",
    a: "Sim: 6 m² em condomínio e 8 m² em ambiente corporativo, mais um ponto de energia 220 V. Abaixo disso o formato compacto não comporta o mix mínimo que faz a loja se sustentar — e instalar uma loja que não se sustenta não interessa a ninguém.",
  },
  {
    q: "Quanto tempo leva da primeira conversa até a loja aberta?",
    a: "De 15 a 30 dias, e a maior parte desse prazo é aprovação, não obra. A instalação em si leva de 4 a 8 horas. Em condomínio que depende de assembleia, o calendário da assembleia costuma ser o item mais demorado do cronograma.",
  },
];

const COMPARATIVO: {
  colunas: [string, string];
  linhas: [string, string, string][];
} = {
  colunas: ["Condomínio", "Empresa"],
  linhas: [
    ["Quem decide", "Síndico ou assembleia", "Facilities, RH ou diretoria"],
    ["Pico de consumo", "22h à 1h e 6h às 8h", "Viradas de turno e madrugada"],
    ["Mix principal", "Reposição doméstica", "Consumo imediato e refeição"],
    ["Área mínima", "6 m²", "8 m²"],
    [
      "Quem paga a compra",
      "Sempre o morador",
      "Colaborador, ou subsidiada pela empresa",
    ],
    ["Custo de implantação", "R$ 0", "R$ 0"],
  ],
};

const COBERTURA = [
  "A operação própria cobre São Paulo e a região metropolitana. Essa delimitação não é comercial, é logística: reposição frequente e manutenção em até 24 horas só se sustentam dentro de um raio que a nossa equipe consegue percorrer no mesmo dia.",
  "Fora dessa área, avaliamos caso a caso conforme o volume do empreendimento. Preferimos dizer não a instalar uma loja que vai ficar desabastecida — a experiência ruim fica com o cliente, e a conta de reputação fica com a marca.",
  "Se o seu condomínio ou a sua empresa está fora de São Paulo, mande a localização pelo formulário. A resposta vem com uma posição honesta sobre prazo, não com uma promessa genérica.",
];

export default function AtuacaoPage(): ReactNode {
  const grafo = montarGrafo([
    schemaWebPage({
      canonical: CANONICAL,
      nome: "Áreas de atuação da MarketGRU",
      descricao: META_DESCRIPTION,
    }),
    schemaBreadcrumb([{ nome: "Atuação", path: CANONICAL }], CANONICAL),
    schemaCollection({
      canonical: CANONICAL,
      nome: "Áreas de atuação",
      descricao: META_DESCRIPTION,
      itens: ATUACAO_AREAS.map((a) => ({
        nome: a.h1,
        path: `/${a.slug}`,
        descricao: a.metaDescription,
      })),
    }),
    schemaFaq(FAQ, CANONICAL),
  ]);

  return (
    <>
      <JsonLd data={grafo} />

      <main id="main-content" className="flex flex-1 flex-col">
        <HeroAtuacao
          trilha={[{ label: "Início", href: "/" }, { label: "Atuação" }]}
          selo="São Paulo e região metropolitana"
          icone={<MapPin className="h-4 w-4" />}
          titulo="Onde a MarketGRU atua"
          resumo={RESUMO}
          imagem="/atuacao.webp"
          imagemAlt="Ilustração 3D de uma mão segurando um celular com o app MarketGRU na tela de pagamento, ao lado de uma maquininha e de um cartão"
          variante="livre"
          acaoPrimaria={{ label: "Agendar visita técnica", href: "/contato" }}
          acaoSecundaria={{ label: "Como funciona", href: "/minimercado" }}
        />

        <section className="mx-auto w-full max-w-6xl px-6 py-8">
          <h2 className="sr-only">Cobertura em números</h2>
          <ContadorNumeros numeros={NUMEROS} />
        </section>

        {/* ── Cards das áreas ───────────────────────────────────────────── */}
        <section className="mx-auto w-full max-w-6xl px-6 py-12 sm:py-16">
          <SeloSecao icone={Columns2}>Dois segmentos</SeloSecao>
          <h2 className="text-foreground [font-family:var(--font-gohan)] text-2xl leading-tight tracking-wide sm:text-[2rem]">
            As duas áreas
          </h2>
          <p className="text-foreground/65 mt-4 [font-family:var(--font-poppins)] text-[17px] leading-relaxed">
            Cada uma tem página própria, com o processo, os formatos e as
            perguntas daquele público. Comece pela que descreve o seu caso.
          </p>

          <GsapReveal
            as="ul"
            seletorFilhos="li"
            saida
            className="mt-9 grid list-none grid-cols-1 gap-5 p-0 lg:grid-cols-2"
          >
            {ATUACAO_AREAS.map((area) => {
              const Icone = area.icon;
              return (
                <li key={area.slug} className="h-full">
                  <Link
                    href={`/${area.slug}`}
                    className="focus-ring group block h-full rounded-3xl"
                  >
                    <CardSpotlight
                      intensidade={18}
                      className="border-foreground/12 group-hover:border-foreground/30 flex h-full flex-col rounded-3xl border transition-colors duration-300"
                    >
                      <span className="bg-foreground/5 relative block aspect-[16/9] w-full overflow-hidden rounded-t-3xl">
                        <Image
                          src={area.imagem}
                          alt={area.imagemAlt}
                          fill
                          sizes="(min-width: 1024px) 560px, 100vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent"
                        />
                        <span className="absolute bottom-4 left-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3.5 py-1.5 backdrop-blur-md">
                          <Icone
                            className="h-4 w-4 text-[var(--mg-accent-soft)]"
                            aria-hidden="true"
                          />
                          <span className="[font-family:var(--font-poppins)] text-[12px] font-semibold tracking-[0.1em] text-white uppercase">
                            {area.label}
                          </span>
                        </span>
                      </span>

                      <span className="flex flex-1 flex-col p-7">
                        <span className="text-foreground [font-family:var(--font-gohan)] text-xl leading-tight tracking-wide sm:text-2xl">
                          {area.h1}
                        </span>

                        <span className="text-foreground/65 mt-3 [font-family:var(--font-poppins)] text-[15px] leading-relaxed">
                          {area.metaDescription}
                        </span>

                        {/* Dois números da própria área: prova concreta no
                            card, sem escrever nada novo para manter. */}
                        <span className="border-foreground/10 mt-6 grid grid-cols-2 gap-4 border-t pt-5">
                          {area.numeros.slice(0, 2).map((n) => (
                            <span key={n.rotulo} className="flex flex-col">
                              <span className="[font-family:var(--font-gohan)] text-lg tracking-wide text-[var(--mg-accent)]">
                                {n.valor}
                              </span>
                              <span className="text-foreground/55 [font-family:var(--font-poppins)] text-[12px] leading-snug">
                                {n.rotulo}
                              </span>
                            </span>
                          ))}
                        </span>

                        <span className="text-foreground/80 mt-6 inline-flex items-center gap-1.5 [font-family:var(--font-poppins)] text-sm font-semibold transition-colors group-hover:text-[var(--mg-accent)]">
                          Ver a página
                          <ArrowUpRight
                            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            aria-hidden="true"
                          />
                        </span>
                      </span>
                    </CardSpotlight>
                  </Link>
                </li>
              );
            })}
          </GsapReveal>
        </section>

        {/* ── Comparativo: o conteúdo que só o hub pode ter ──────────────── */}
        <section className="mx-auto w-full max-w-6xl px-6 py-12 sm:py-16">
          <SeloSecao icone={Scale}>Condomínio x Empresa</SeloSecao>
          <h2 className="text-foreground [font-family:var(--font-gohan)] text-2xl leading-tight tracking-wide sm:text-[2rem]">
            O que muda de um segmento para o outro
          </h2>
          <p className="text-foreground/65 mt-4 [font-family:var(--font-poppins)] text-[17px] leading-relaxed">
            O modelo comercial é idêntico nos dois: a loja é instalada e operada
            por nós, sem custo de implantação. A diferença está em quem decide,
            no que as pessoas compram e na hora em que compram.
          </p>

          <GsapReveal saida>
            <ComparativoVersus
              legenda="Comparativo entre mercado para condomínio e para empresa"
              colunas={COMPARATIVO.colunas}
              linhas={COMPARATIVO.linhas}
            />
          </GsapReveal>
        </section>

        {/* ── Cobertura ─────────────────────────────────────────────────── */}
        <section className="mx-auto w-full max-w-6xl px-6 py-12 sm:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.85fr]">
            <div>
              <SeloSecao icone={Truck}>Logística</SeloSecao>
              <h2 className="text-foreground [font-family:var(--font-gohan)] text-2xl leading-tight tracking-wide sm:text-[2rem]">
                Cobertura e logística
              </h2>
              <GsapReveal
                seletorFilhos="[data-rev]"
                saida
                className="mt-6 flex max-w-2xl flex-col gap-4"
              >
                {COBERTURA.map((p, i) => (
                  <p
                    key={i}
                    data-rev
                    className="text-foreground/75 [font-family:var(--font-poppins)] text-[17px] leading-relaxed"
                  >
                    {p}
                  </p>
                ))}
              </GsapReveal>
            </div>

            <GsapReveal saida>
              <RaioCobertura cidades={CIDADES} />
            </GsapReveal>
          </div>
        </section>

        <FaqAccordion
          itens={FAQ}
          titulo="Perguntas frequentes sobre nossa atuação"
          intro="O que perguntam antes de escolher o segmento e agendar a visita técnica."
          id="faq-atuacao"
        />

        <ContactCard />
        <div className="h-12 sm:h-16" />
      </main>
    </>
  );
}

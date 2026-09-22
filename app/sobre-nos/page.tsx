import { Stack } from "@/components/sobre-nos/stack";
import { Valores } from "@/components/sobre-nos/valores";
import { ContactCard } from "@/components/contact/contact-card";
import { GrainientBackground } from "@/components/shaders/grainient-background";
import { FadeIn } from "@/components/ui/motion-primitives";
import SplitText from "@/components/ui/split-text";
import { createMetadata } from "@/lib/metadata";
import { JsonLd } from "@/components/seo/json-ld";
import { montarGrafo, schemaBreadcrumb, schemaWebPage } from "@/lib/schema";
import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Sobre a MarketGRU: quem opera os mercados",
  description:
    "Quem é a MarketGRU: operamos minimercados autônomos em condomínios e empresas de São Paulo, com instalação sem custo e reposição feita pela nossa equipe.",
  path: "/sobre-nos",
});

export default function AboutPage(): ReactNode {
  /* AboutPage aponta para a Organization: é o nó que diz a um motor
     generativo que esta página descreve a EMPRESA, e não um serviço. */
  const grafo = montarGrafo([
    {
      "@type": "AboutPage",
      "@id": "https://www.marketgru.com.br/sobre-nos#aboutpage",
      url: "https://www.marketgru.com.br/sobre-nos",
      name: "Sobre a MarketGRU",
      inLanguage: "pt-BR",
      mainEntity: { "@id": "https://www.marketgru.com.br/#organization" },
    },
    schemaWebPage({
      canonical: "/sobre-nos",
      nome: "Sobre a MarketGRU",
      descricao:
        "Quem é a MarketGRU: operamos minimercados autônomos em condomínios e empresas de São Paulo, com instalação sem custo e reposição feita pela nossa equipe.",
    }),
    schemaBreadcrumb([{ nome: "Sobre Nós", path: "/sobre-nos" }], "/sobre-nos"),
  ]);

  return (
    <>
      <JsonLd data={grafo} />
      <main id="main-content" className="relative flex flex-1 flex-col">
      <GrainientBackground className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-225 overflow-hidden" />

      <section className="mx-auto w-full px-6 pt-40 pb-16 sm:px-30 sm:pt-56 sm:pb-24">
        <FadeIn delay={0.3}>
          <div className="border-foreground/10 bg-background/80 flex flex-col gap-8 rounded-4xl border p-8 backdrop-blur-xl sm:p-12 lg:flex-row lg:items-stretch lg:gap-12">
            <div className="flex-1">
              <h1 className="text-foreground font-serif text-[1.75rem] font-medium tracking-tight sm:text-[2rem]">
                <SplitText
                  text="Somos a MarketGRU"
                  tag="span"
                  className="[font-family:var(--font-gohan)] tracking-wider"
                  textAlign="left"
                  delay={25}
                  duration={0.8}
                  ease="power3.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 40 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-50px"
                />
              </h1>
              <div className="text-foreground/75 mt-8 space-y-6 [font-family:var(--font-poppins)] text-[17px] leading-[1.7] tracking-tight sm:text-[18px]">
                <p>
                  A{" "}
                  <strong className="text-foreground font-semibold">
                    MarketGRU
                  </strong>{" "}
                  nasceu para transformar a forma como condomínios e empresas
                  oferecem comodidade no dia a dia. Instalamos{" "}
                  <strong className="text-foreground font-semibold">
                    minimercados autônomos
                  </strong>{" "}
                  que funcionam 24 horas por dia, sem filas, sem operador de
                  caixa e sem custo de implantação.
                </p>
                <p>
                  Tudo começou com uma ideia simples: e se o morador pudesse
                  comprar aquilo que precisa a qualquer hora, dentro do próprio
                  prédio? A partir daí, unimos{" "}
                  <strong className="text-foreground font-semibold">
                    tecnologia, praticidade e produtos de marcas conhecidas
                  </strong>{" "}
                  para criar mercados que rodam sozinhos, com pagamento por app,
                  Pix ou cartão.
                </p>
                <p>
                  Hoje levamos mais{" "}
                  <strong className="text-foreground font-semibold">
                    conforto para os moradores e valorização para o condomínio
                  </strong>
                  , sempre com reposição contínua, atendimento próximo e o
                  compromisso de fazer cada parceria durar.
                </p>
              </div>
            </div>
            <div className="group ring-foreground/5 relative min-h-[16rem] w-full shrink-0 overflow-hidden rounded-3xl ring-1 transition-shadow duration-500 hover:shadow-2xl lg:min-h-0 lg:w-[22rem]">
              <Image
                src="/minimercado-1.webp"
                alt="Minimercado autônomo MarketGRU instalado em condomínio"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                sizes="(max-width: 1024px) 100vw, 22rem"
                priority
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
          </div>
        </FadeIn>
      </section>

      <section className="mx-auto w-full px-6 pb-20 sm:px-30">
        <FadeIn delay={0.1}>
          <div className="flex flex-col gap-10">
            <Valores />
            <Stack />
          </div>
        </FadeIn>
      </section>

      <ContactCard />
      <div className="h-12 sm:h-16" />
    </main>
    </>
  );
}

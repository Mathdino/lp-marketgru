import { ContactCard } from "@/components/contact/contact-card";
import { GrainientBackground } from "@/components/shaders/grainient-background";
import { FadeIn } from "@/components/ui/motion-primitives";
import SplitText from "@/components/ui/split-text";
import { createMetadata } from "@/lib/metadata";
import { JsonLd } from "@/components/seo/json-ld";
import { montarGrafo, schemaBreadcrumb, schemaWebPage } from "@/lib/schema";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Contato: agende a visita técnica",
  description:
    "Fale com a MarketGRU para instalar um minimercado autônomo no seu condomínio ou empresa. Visita técnica sem custo e sem compromisso, em São Paulo e região.",
  path: "/contato",
});

export default function ProjectsPage(): ReactNode {
  /* ContactPage só existe nesta URL. Emitir em toda página seria dizer ao
     Google que o site inteiro é uma página de contato. */
  const grafo = montarGrafo([
    {
      "@type": "ContactPage",
      "@id": "https://www.marketgru.com.br/contato#contactpage",
      url: "https://www.marketgru.com.br/contato",
      name: "Contato MarketGRU",
      inLanguage: "pt-BR",
      about: { "@id": "https://www.marketgru.com.br/#organization" },
    },
    schemaWebPage({
      canonical: "/contato",
      nome: "Contato",
      descricao:
        "Fale com a MarketGRU para instalar um minimercado autônomo no seu condomínio ou empresa. Visita técnica sem custo e sem compromisso, em São Paulo e região.",
    }),
    schemaBreadcrumb([{ nome: "Contato", path: "/contato" }], "/contato"),
  ]);

  return (
    <>
      <JsonLd data={grafo} />
      <main id="main-content" className="relative flex flex-1 flex-col">
      <GrainientBackground className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-225 overflow-hidden" />
      <section className="mx-auto w-full px-6 pt-44 sm:px-10">
        <FadeIn className="flex flex-col items-center gap-5 text-center">
          <h1 className="text-foreground font-serif text-[2.75rem] leading-[1.05] font-medium tracking-tight md:text-[3.25rem] lg:text-[3.75rem]">
            <SplitText
              text="Contato"
              tag="span"
              className="[font-family:var(--font-gohan)] tracking-wider"
              textAlign="center"
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
          <p className="text-foreground/65 [font-family:var(--font-poppins)] text-[20px] leading-[1.4] tracking-tight sm:text-[22px]">
            Preencha o formulário e entre em contato pelo WhatsApp.
          </p>
        </FadeIn>
      </section>
      <ContactCard />
      <div className="h-12 sm:h-16" />
    </main>
    </>
  );
}

import { ContactCard } from "@/components/contact/contact-card";
import { FadeIn } from "@/components/ui/motion-primitives";
import SplitText from "@/components/ui/split-text";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Contato",
  description:
    "Minimercado para condomínios e empresas - Fácil, Rápido e Sem Custo. Ideal para oferecer conforto e praticidade no dia a dia.",
  path: "/contato",
});

export default function ProjectsPage(): ReactNode {
  return (
    <main id="main-content" className="flex flex-1 flex-col">
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
          <p className="text-foreground/65 text-[20px] leading-[1.4] tracking-tight sm:text-[22px]">
            Preencha o formulário e entre em contato pelo WhatsApp.
          </p>
        </FadeIn>
      </section>
      <ContactCard />
      <div className="h-12 sm:h-16" />
    </main>
  );
}

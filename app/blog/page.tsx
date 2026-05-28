import { ContactCard } from "@/components/contact/contact-card";
import { BlogList } from "@/components/blog/blog-list";
import { GrainientBackground } from "@/components/shaders/grainient-background";
import { FadeIn } from "@/components/ui/motion-primitives";
import SplitText from "@/components/ui/split-text";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Blog",
  description:
    "Confira artigos, dicas e novidades sobre minimercados autônomos, conveniência 24h e tecnologia para condomínios.",
  path: "/blog",
});

export default function BlogPage(): ReactNode {
  return (
    <main id="main-content" className="relative flex flex-1 flex-col">
      <GrainientBackground className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-225 overflow-hidden" />
      <section className="mx-auto w-full max-w-275 px-6 pt-44 pb-16 sm:px-10 sm:pb-20">
        <FadeIn className="flex flex-col items-center gap-5 text-center">
          <h1 className="text-foreground font-serif text-[2.75rem] leading-[1.05] font-medium tracking-tight md:text-[3.25rem] lg:text-[3.75rem]">
            <SplitText
              text="Blog"
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
            Conteúdos, dicas e novidades sobre o universo Market Gru.
          </p>
        </FadeIn>
      </section>
      <BlogList />
      <ContactCard />
      <div className="h-12 sm:h-16" />
    </main>
  );
}

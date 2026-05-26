import { ContactCard } from "@/components/contact/contact-card";
import { FaqSection } from "@/components/faq/faq-section";
import { Hero } from "@/components/hero/hero";
import { SpMapStatsSection } from "@/components/hero/sp-map-section";
import { TiltedCardSection } from "@/components/hero/tilted-card-section";
import { TudoPrecisaSection } from "@/components/hero/tudo-precisa-section";
import { Projects } from "@/components/projects/projects";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { FadeIn } from "@/components/ui/motion-primitives";
import { createMetadata, siteConfig } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import SplitText from "@/components/ui/split-text";

const TESTIMONIALS = [
  {
    description:
      "ScrollX-UI has completely transformed how I build interfaces. The animations are silky smooth, and the components are modular and responsive.",
    image:
      "https://images.unsplash.com/photo-1611558709798-e009c8fd7706?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    name: "Isabelle Carlos",
    handle: "@isabellecarlos",
  },
  {
    description:
      "I love how ScrollX-UI makes my projects look professional with minimal effort. The documentation is clear and the community is super helpful.",
    image:
      "https://plus.unsplash.com/premium_photo-1692340973636-6f2ff926af39?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    name: "Lana Akash",
    handle: "@lanaakash",
  },
  {
    description:
      "The smooth scrolling animations and intuitive components in ScrollX-UI save me hours of development time!",
    image:
      "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    name: "Liam O'Connor",
    handle: "@liamoc",
  },
  {
    description:
      "Using ScrollX-UI feels like magic — it's so easy to create beautiful, interactive UIs without writing complex code.",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    name: "Isabella Mendes",
    handle: "@isamendes",
  },
  {
    description:
      "ScrollX-UI's open-source nature means I can customize components exactly how I want them — plus, the performance is outstanding.",
    image:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    name: "Meera Patel",
    handle: "@meerapatel",
  },
  {
    description:
      "I recommend ScrollX-UI to everyone looking for a powerful, flexible UI library with stunning animation support.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    name: "Emily Chen",
    handle: "@emchen",
  },
];

export const metadata: Metadata = createMetadata({
  title: "Minimercado para condomínios",
  description: `Soluções inteligentes para condomínios com tecnologia, segurança e praticidade para transformar a gestão e o dia a dia.`,
  path: "/",
});

export default function HomePage(): ReactNode {
  return (
    <main id="main-content" className="flex flex-1 flex-col gap-10">
      <Hero />
      <TudoPrecisaSection />
      <TiltedCardSection />
      <SpMapStatsSection />

      <FadeIn className="flex flex-col items-center gap-5 text-center">
        <h1 className="text-foreground font-serif text-[2.75rem] leading-[1.05] font-medium tracking-tight md:text-[3.25rem] lg:text-[3.75rem]">
          <SplitText
            text="Depoimentos"
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
          Veja como a Market Gru vem trazendo mais praticidade e comodidade para
          condomínios.
        </p>
      </FadeIn>

      <section className="w-full">
        <AnimatedTestimonials data={TESTIMONIALS} />
      </section>

      <FaqSection />

      <ContactCard />
      <div className="h-12 sm:h-16" />
    </main>
  );
}

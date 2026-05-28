import { Education } from "@/components/sobre-nos/education";
import { Experience } from "@/components/sobre-nos/experience";
import { PolaroidStrip } from "@/components/sobre-nos/polaroid-strip";
import { Skills } from "@/components/sobre-nos/skills";
import { Stack } from "@/components/sobre-nos/stack";
import { ContactCard } from "@/components/contact/contact-card";
import { GrainientBackground } from "@/components/shaders/grainient-background";
import { FadeIn } from "@/components/ui/motion-primitives";
import SplitText from "@/components/ui/split-text";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Sobre Nós",
  description:
    "Conheça nossa história, missão e valores. Desenvolvemos soluções inovadoras com foco em qualidade, tecnologia e resultados.",
  path: "/sobre-nos",
});

export default function AboutPage(): ReactNode {
  return (
    <main id="main-content" className="relative flex flex-1 flex-col">
      <GrainientBackground className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-225 overflow-hidden" />
      <section className="mx-auto w-full max-w-312 pt-40 sm:pt-56">
        <PolaroidStrip />
      </section>

      <section className="mx-auto w-full max-w-160 px-6 pt-20 pb-16 sm:px-10 sm:pt-28 sm:pb-24">
        <FadeIn delay={0.5}>
          <div className="border-foreground/5 bg-foreground/1.5 dark:bg-foreground/3 rounded-4xl border p-8 sm:p-12">
            <h1 className="text-foreground font-serif text-[1.75rem] font-medium tracking-tight sm:text-[2rem]">
              <SplitText
                text="Hello! I'm Josh Mercer."
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
            <div className="text-foreground/75 mt-8 space-y-6 text-[17px] leading-[1.7] tracking-tight sm:text-[18px]">
              <p>
                A{" "}
                <strong className="text-foreground font-semibold">
                  product designer and frontend engineer
                </strong>{" "}
                passionate about building intuitive, human-centered digital
                experiences. With a background in{" "}
                <strong className="text-foreground font-semibold">
                  visual craft
                </strong>{" "}
                and{" "}
                <strong className="text-foreground font-semibold">
                  interaction design
                </strong>
                , I bring a unique blend of design thinking and technical
                execution to every project.
              </p>
              <p>
                My journey into design began when I realized how often good user
                experience was missing from powerful tools. That led me to
                embrace{" "}
                <strong className="text-foreground font-semibold">
                  user-centered design
                </strong>{" "}
                as both a mindset and a craft, one that balances clarity,
                creativity, and functionality.
              </p>
              <p>
                Currently leading design at small product teams shipping
                software for{" "}
                <strong className="text-foreground font-semibold">
                  creative professionals
                </strong>
                , I&rsquo;m always looking for opportunities to{" "}
                <strong className="text-foreground font-semibold">
                  shape thoughtful interfaces and build scalable design systems
                </strong>
                .
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      <section className="mx-auto w-full max-w-[40rem] px-6 pb-20 sm:px-10 sm:pb-28">
        <FadeIn delay={0.1}>
          <div className="flex flex-col gap-10">
            <Experience />
            <Education />
            <Skills />
            <Stack />
          </div>
        </FadeIn>
      </section>

      <ContactCard />
      <div className="h-12 sm:h-16" />
    </main>
  );
}

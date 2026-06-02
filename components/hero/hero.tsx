import type { ReactNode } from "react";

import { HeroCtas } from "./hero-ctas";
import { FadeIn, ScaleUnblur } from "@/components/ui/motion-primitives";
import SplitText from "@/components/ui/split-text";

export function Hero(): ReactNode {
  return (
    <section className="relative w-full overflow-visible bg-[#f73019]">
      <div className="relative mx-auto w-full px-6 pt-24 pb-0 sm:px-20">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-8">
          <FadeIn className="flex flex-col gap-4">
            <h1 className="text-foreground font-serif text-[2.75rem] leading-[1.05] font-medium tracking-tight md:text-[2.5rem] lg:text-[3.8rem]">
              <SplitText
                text="Mais conforto para moradores,"
                tag="span"
                className="block [font-family:var(--font-gohan)] tracking-wider"
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
              <SplitText
                text="mais valor para o condomínio"
                tag="span"
                className="block [font-family:var(--font-gohan)] tracking-wider"
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

            <p className="text-foreground/65 [font-family:var(--font-poppins)] text-[22px] leading-[1.4] tracking-tight">
              Conveniência inteligente 24 horas para o seu condomínio.
            </p>

            <HeroCtas />
          </FadeIn>

          <ScaleUnblur className="relative z-30 flex justify-stretch md:justify-end">
            <div className="relative mb-[-50px] w-full sm:mb-[-100px] md:mb-[-140px] lg:mb-[-92px]">
              <img
                src="/banner.png"
                alt="Banner"
                className="block w-full object-contain"
                style={{
                  filter: "drop-shadow(0 20px 18px rgba(0,0,0,0.18))",
                }}
              />
            </div>
          </ScaleUnblur>
        </div>
      </div>
    </section>
  );
}

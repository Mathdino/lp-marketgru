"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* =============================================================================
   LINHA DO TEMPO COM TRAÇO QUE ACOMPANHA A ROLAGEM

   O traço vertical cresce conforme o usuário desce, e cada marcador acende
   quando o traço chega nele. É o único efeito "scrubbed" da página, e tem
   função: mostra progresso dentro de um processo de 5 etapas, que é
   exatamente a dúvida de quem lê ("quanto falta até a loja abrir?").

   O conteúdo NÃO depende do efeito: os passos são <li> comuns, numerados pelo
   servidor. Sem JavaScript some o traço, não a informação.
   ========================================================================== */

type Props = {
  passos: { titulo: string; texto: string }[];
};

export function LinhaPassos({ passos }: Props): ReactNode {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const raiz = ref.current;
      if (!raiz) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          anima: "(prefers-reduced-motion: no-preference)",
          reduzido: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          // Com movimento reduzido o traço fica cheio e os marcadores acesos:
          // o estado final, sem nenhum movimento.
          if (ctx.conditions?.reduzido) {
            gsap.set("[data-traco]", { scaleY: 1 });
            gsap.set("[data-marcador]", { backgroundColor: "var(--mg-accent)", scale: 1 });
            return;
          }

          gsap.set("[data-traco]", { scaleY: 0, transformOrigin: "top center" });

          gsap.to("[data-traco]", {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: raiz,
              start: "top 70%",
              end: "bottom 75%",
              scrub: 0.4,
            },
          });

          const marcadores: HTMLElement[] = gsap.utils.toArray(
            "[data-marcador]",
            raiz
          );
          marcadores.forEach((m) => {
            gsap.fromTo(
              m,
              { scale: 0.55, backgroundColor: "color-mix(in oklab, currentColor 20%, transparent)" },
              {
                scale: 1,
                backgroundColor: "var(--mg-accent)",
                duration: 0.3,
                ease: "back.out(2)",
                scrollTrigger: { trigger: m, start: "top 78%", once: true },
              }
            );
          });

          const corpos: HTMLElement[] = gsap.utils.toArray("[data-passo]", raiz);
          gsap.set(corpos, { y: 18, autoAlpha: 0 });
          corpos.forEach((c) => {
            gsap.to(c, {
              y: 0,
              autoAlpha: 1,
              duration: 0.4,
              ease: "power2.out",
              clearProps: "transform,opacity,visibility",
              scrollTrigger: { trigger: c, start: "top 92%", once: true },
            });
          });
        }
      );

      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className="relative mt-10 pl-10 sm:pl-14">
      {/* Trilho e traço vivem fora do fluxo: não empurram nada e não geram CLS. */}
      <span
        aria-hidden="true"
        className="bg-foreground/10 absolute top-2 bottom-2 left-[13px] w-px sm:left-[17px]"
      />
      <span
        aria-hidden="true"
        data-traco
        className="absolute top-2 bottom-2 left-[13px] w-px bg-[var(--mg-accent)] sm:left-[17px]"
      />

      <ol className="m-0 flex list-none flex-col gap-9 p-0">
        {passos.map((p, i) => (
          <li key={p.titulo} className="relative">
            <span
              aria-hidden="true"
              data-marcador
              className="absolute top-1.5 -left-10 grid h-[27px] w-[27px] place-items-center rounded-full text-[11px] font-bold text-white sm:-left-14 sm:h-[35px] sm:w-[35px] sm:text-xs"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div data-passo>
              <h3 className="text-foreground text-lg font-semibold sm:text-xl">
                {p.titulo}
              </h3>
              <p className="text-foreground/65 mt-1.5 max-w-2xl text-[15px] leading-relaxed">
                {p.texto}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

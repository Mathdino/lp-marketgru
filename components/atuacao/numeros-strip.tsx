"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* =============================================================================
   FAIXA DE NÚMEROS

   Só entrada em série, sem contagem progressiva. A primeira versão animava o
   número de 0 até o valor, e isso foi removido de propósito: um número que
   anima é um número que fica errado no caminho. Numa página cujo argumento
   central é "R$ 0 de implantação", exibir qualquer valor diferente de zero,
   mesmo por meio segundo, é dizer algo que não é verdade.

   Além disso, contagem só impressiona em número grande. Aqui os valores são
   qualificadores curtos ("24h", "SP", "6 m²") — contar até eles não comunica
   nada e ainda atrasa a leitura.

   O valor vem do servidor no HTML. Se o JS não rodar, o número correto já está
   na tela e continua legível por crawler.
   ========================================================================== */

type Props = {
  numeros: { valor: string; rotulo: string }[];
};

export function NumerosStrip({ numeros }: Props): ReactNode {
  const ref = useRef<HTMLUListElement>(null);

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
          if (ctx.conditions?.reduzido) return;

          const itens: HTMLElement[] = gsap.utils.toArray("[data-num]", raiz);
          if (!itens.length) return;

          gsap.set(itens, { y: 18, autoAlpha: 0 });
          gsap.to(itens, {
            y: 0,
            autoAlpha: 1,
            duration: 0.45,
            stagger: 0.07,
            ease: "power2.out",
            clearProps: "transform,opacity,visibility",
            scrollTrigger: { trigger: raiz, start: "top 95%", once: true },
          });
        }
      );

      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <ul
      ref={ref}
      className="border-foreground/10 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border lg:grid-cols-4"
      style={{ background: "color-mix(in oklab, currentColor 10%, transparent)" }}
    >
      {numeros.map((n) => (
        <li
          key={n.rotulo}
          data-num
          className="bg-background flex flex-col gap-1 p-6 sm:p-7"
        >
          <span className="[font-family:var(--font-gohan)] text-3xl leading-none tracking-wide text-[var(--mg-accent)] sm:text-4xl">
            {n.valor}
          </span>
          <span className="text-foreground/60 text-[13px] leading-snug">
            {n.rotulo}
          </span>
        </li>
      ))}
    </ul>
  );
}

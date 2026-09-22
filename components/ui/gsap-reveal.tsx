"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* =============================================================================
   REVEAL COM GSAP

   Três decisões que valem mais que o efeito:

   1. O estado inicial é aplicado por JS (gsap.set), nunca por CSS. Se o script
      falhar, se o usuário pedir movimento reduzido ou se o crawler não executar
      JavaScript, o conteúdo aparece normalmente. `opacity: 0` no stylesheet
      esperando um script que pode não rodar é como se perde conteúdo.

   2. gsap.matchMedia() cuida do breakpoint E do prefers-reduced-motion, e
      reverte tudo sozinho quando a condição deixa de casar. Com movimento
      reduzido, nada é animado — nem o estado inicial é aplicado.

   3. Animação de entrada é tempero, não espera. O gatilho dispara em `top 95%`,
      quando o elemento mal encostou na viewport, e a duração fica abaixo de meio
      segundo. Animação que faz esperar para ler atrapalha a leitura.
   ========================================================================== */

type Props = {
  children: ReactNode;
  className?: string;
  /** Seletor dos filhos a animar em série. Sem ele, anima o próprio container. */
  seletorFilhos?: string;
  /** Deslocamento vertical inicial, em px. */
  y?: number;
  /** Intervalo entre os filhos, em segundos. */
  stagger?: number;
  /** Atraso antes de começar, em segundos. */
  delay?: number;
  /**
   * Anima também na SAÍDA: ao rolar de volta para cima o bloco desfaz a
   * entrada, e refaz quando volta à viewport. Sem isso a animação roda uma vez
   * e nunca mais (o padrão, e o certo para texto longo — desmontar e remontar
   * parágrafo que a pessoa está lendo é hostil).
   */
  saida?: boolean;
  as?: "div" | "section" | "ul" | "ol";
};

export function GsapReveal({
  children,
  className,
  seletorFilhos,
  y = 24,
  stagger = 0.06,
  delay = 0,
  saida = false,
  as: Tag = "div",
}: Props): ReactNode {
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
          // Movimento reduzido: sai sem tocar em nada. O conteúdo já está
          // visível porque o CSS nunca o escondeu.
          if (ctx.conditions?.reduzido) return;

          const alvos: Element[] = seletorFilhos
            ? gsap.utils.toArray(seletorFilhos, raiz)
            : [raiz];
          if (!alvos.length) return;

          gsap.set(alvos, { y, autoAlpha: 0 });

          gsap.to(alvos, {
            y: 0,
            autoAlpha: 1,
            duration: 0.45,
            ease: "power2.out",
            stagger,
            delay,
            // Com saída o clearProps não pode entrar: limpar os estilos inline
            // no fim da entrada apagaria justamente o que a reversão precisa
            // manipular. Sem saída ele fica, devolvendo o elemento ao
            // stylesheet para nada inline sobrar prendendo o conteúdo.
            ...(saida ? {} : { clearProps: "transform,opacity,visibility" }),
            scrollTrigger: saida
              ? {
                  trigger: raiz,
                  start: "top 92%",
                  end: "bottom 8%",
                  toggleActions: "play reverse play reverse",
                }
              : { trigger: raiz, start: "top 95%", once: true },
          });
        }
      );

      return () => mm.revert();
    },
    { scope: ref, dependencies: [seletorFilhos, y, stagger, delay, saida] }
  );

  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}

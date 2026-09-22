"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";

/* =============================================================================
   CARD COM FAROL

   Um brilho de acento segue o cursor dentro do card. É decoração pura: o card
   é um <div> comum com o conteúdo por dentro, e sem JS (ou em toque, onde não
   existe cursor) ele fica exatamente igual, só sem o brilho.

   A posição vai para variáveis CSS em vez de state do React: mover o mouse não
   pode custar um render por quadro.
   ========================================================================== */

type Props = {
  children: ReactNode;
  className?: string;
  /** Intensidade do brilho, em % de cor de acento. */
  intensidade?: number;
};

export function CardSpotlight({
  children,
  className = "",
  intensidade = 14,
}: Props): ReactNode {
  const ref = useRef<HTMLDivElement>(null);

  const mover = (ev: React.MouseEvent<HTMLDivElement>): void => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${ev.clientX - r.left}px`);
    el.style.setProperty("--spot-y", `${ev.clientY - r.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={mover}
      className={`group/spot relative isolate overflow-hidden ${className}`}
      style={
        {
          "--spot-x": "50%",
          "--spot-y": "0%",
        } as CSSProperties
      }
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{
          background: `radial-gradient(18rem 18rem at var(--spot-x) var(--spot-y), color-mix(in oklab, var(--mg-accent) ${intensidade}%, transparent) 0%, transparent 65%)`,
        }}
      />
      {children}
    </div>
  );
}

"use client";

import { useState, type ReactNode } from "react";
import { Plus } from "lucide-react";

/* =============================================================================
   ACORDEÃO DE FAQ — dirigido por props.

   O componente antigo (`faq-section.tsx`) traz as perguntas embutidas e serve
   só à home. Este recebe o array, para que cada página tenha o SEU FAQ — que é
   a regra anti-doorway do guia: página sem pergunta própria é página clonada.

   O mesmo array que alimenta este componente alimenta o FAQPage no JSON-LD da
   página. É isso que garante a paridade markup ↔ tela; schema com pergunta que
   não está na tela é o caminho mais curto para perder o rich result.

   Acessibilidade: <button> nativo, `aria-expanded` e `aria-controls`. A resposta
   fica no DOM mesmo fechada — com `hidden`, não com display:none via classe —
   para que continue legível por crawler e por agente de compra.
   ========================================================================== */

type Props = {
  itens: { q: string; a: string }[];
  titulo?: string;
  intro?: string;
  id?: string;
};

export function FaqAccordion({
  itens,
  titulo = "Perguntas frequentes",
  intro,
  id = "faq",
}: Props): ReactNode {
  const [aberto, setAberto] = useState<number | null>(0);

  if (!itens.length) return null;

  return (
    <section id={id} className="mx-auto w-full max-w-5xl py-20 sm:py-24">
      <h2 className="[font-family:var(--font-gohan)] text-3xl leading-tight tracking-wide sm:text-4xl">
        {titulo}
      </h2>
      {intro && (
        <p className="text-foreground/65 mt-3 text-base leading-relaxed">
          {intro}
        </p>
      )}

      <dl className="border-foreground/10 mt-10 border-t">
        {itens.map((item, i) => {
          const estaAberto = aberto === i;
          const painelId = `${id}-painel-${i}`;
          const botaoId = `${id}-botao-${i}`;

          return (
            <div key={item.q} className="border-foreground/10 border-b">
              <dt>
                <button
                  type="button"
                  id={botaoId}
                  aria-expanded={estaAberto}
                  aria-controls={painelId}
                  onClick={() => setAberto(estaAberto ? null : i)}
                  className="focus-ring group flex w-full cursor-pointer items-start justify-between gap-6 py-5 text-left"
                >
                  <span className="text-foreground text-base font-semibold sm:text-lg">
                    {item.q}
                  </span>
                  <span
                    aria-hidden="true"
                    className="border-foreground/15 text-foreground/70 mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-transform duration-300"
                    style={{
                      transform: estaAberto ? "rotate(45deg)" : "rotate(0deg)",
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </span>
                </button>
              </dt>
              <dd
                id={painelId}
                role="region"
                aria-labelledby={botaoId}
                hidden={!estaAberto}
                className="text-foreground/70 m-0 pb-6 text-[15px] leading-relaxed sm:text-base"
              >
                {item.a}
              </dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}

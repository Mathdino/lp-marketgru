"use client";

import { animate, useInView } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

/* =============================================================================
   FAIXA DE NÚMEROS COM CONTAGEM

   Os valores vêm do array como texto curto ("24h", "R$ 0", "6 m²", "SP"),
   porque é assim que eles aparecem na página e no schema. Aqui o texto é
   quebrado em prefixo + número + sufixo, e SÓ o número é animado:

     "R$ 0"  → prefixo "R$ ", alvo 0   → conta de 0 a 0, ou seja, nunca exibe
                                          valor diferente do real (a página
                                          inteira se apoia nesse zero)
     "24h"   → alvo 24, sufixo "h"
     "SP"    → sem número: entra estático, sem contagem nenhuma

   O HTML do servidor já traz o valor final. Se o JS não rodar, o número certo
   está na tela e o crawler lê — a contagem é enfeite, não conteúdo.
   ========================================================================== */

type Numero = { valor: string; rotulo: string };

/** Separa "R$ 1.200,50" em {prefixo:"R$ ", numero:1200.5, sufixo:""}. */
function fatiar(valor: string): {
  prefixo: string;
  numero: number | null;
  sufixo: string;
  decimais: number;
} {
  const match = valor.match(/(\d[\d.]*(?:,\d+)?)/);
  const bruto = match?.[1];
  if (!match || bruto === undefined || match.index === undefined) {
    return { prefixo: valor, numero: null, sufixo: "", decimais: 0 };
  }

  const normalizado = bruto.replace(/\./g, "").replace(",", ".");
  const numero = Number.parseFloat(normalizado);
  const decimais = normalizado.includes(".")
    ? (normalizado.split(".")[1]?.length ?? 0)
    : 0;

  return {
    prefixo: valor.slice(0, match.index),
    numero: Number.isFinite(numero) ? numero : null,
    sufixo: valor.slice(match.index + bruto.length),
    decimais,
  };
}

function ValorAnimado({
  valor,
  ativo,
}: {
  valor: string;
  ativo: boolean;
}): ReactNode {
  const { prefixo, numero, sufixo, decimais } = fatiar(valor);

  /* O estado nasce no valor FINAL: é o que o servidor renderiza e o que fica
     na tela se o JS não rodar, se a pessoa pedir movimento reduzido ou se o
     número for zero. A contagem só substitui isso quando de fato acontece. */
  const [atual, setAtual] = useState(numero ?? 0);

  useEffect(() => {
    if (numero === null || numero === 0 || !ativo) return;

    const prefereParado =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefereParado) return;

    const controls = animate(0, numero, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setAtual(v),
    });
    return () => controls.stop();
  }, [ativo, numero]);

  if (numero === null) return <>{valor}</>;

  const formatado = atual.toLocaleString("pt-BR", {
    minimumFractionDigits: decimais,
    maximumFractionDigits: decimais,
  });

  return (
    <>
      {prefixo}
      {/* tabular-nums trava a largura dos dígitos: sem isso o card "pulsa"
          de largura a cada quadro da contagem. */}
      <span className="tabular-nums">{formatado}</span>
      {sufixo}
    </>
  );
}

export function ContadorNumeros({
  numeros,
}: {
  numeros: Numero[];
}): ReactNode {
  const ref = useRef<HTMLUListElement>(null);
  const naTela = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <ul
      ref={ref}
      className="border-foreground/10 bg-foreground/[0.02] grid list-none grid-cols-2 gap-px overflow-hidden rounded-3xl border p-0 lg:grid-cols-4"
      style={{ background: "color-mix(in oklab, currentColor 8%, transparent)" }}
    >
      {numeros.map((n, i) => (
        <li
          key={n.rotulo}
          className="bg-background group relative flex flex-col gap-1.5 p-6 transition-colors duration-300 sm:p-7"
          style={{ transitionDelay: `${i * 40}ms` }}
        >
          {/* Brilho de acento no hover: some no mobile, onde hover não existe,
              e não interfere em leitura nenhuma. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(140% 100% at 50% 0%, color-mix(in oklab, var(--mg-accent) 12%, transparent) 0%, transparent 70%)",
            }}
          />
          <span className="relative [font-family:var(--font-gohan)] text-3xl leading-none tracking-wide text-[var(--mg-accent)] sm:text-4xl">
            <ValorAnimado valor={n.valor} ativo={naTela} />
          </span>
          <span className="text-foreground/60 relative [font-family:var(--font-poppins)] text-[13px] leading-snug">
            {n.rotulo}
          </span>
        </li>
      ))}
    </ul>
  );
}

"use client";

import { useState, type ReactNode } from "react";

/* =============================================================================
   COMPARATIVO "VERSUS"

   Mesma informação da tabela antiga, em dois formatos conforme o espaço:

     · largura grande  → duas colunas lado a lado, com o critério ao centro.
       Comparar é justamente ler as duas respostas no mesmo eixo do olho;
     · largura pequena → alternador. Empilhar seis linhas de duas colunas em
       tela de celular produz texto de duas palavras por linha, que não se lê.

   A tabela semântica continua existindo para leitor de tela e crawler: o bloco
   visual é aria-hidden e a <table> fica em sr-only. Ninguém perde a estrutura
   por causa do desenho.
   ========================================================================== */

type Props = {
  legenda: string;
  colunas: [string, string];
  linhas: [string, string, string][];
};

export function ComparativoVersus({
  legenda,
  colunas,
  linhas,
}: Props): ReactNode {
  const [ativa, setAtiva] = useState<0 | 1>(0);

  return (
    <div className="mt-8">
      {/* ── Estrutura real, para leitor de tela e crawler ─────────────────── */}
      <table className="sr-only">
        <caption>{legenda}</caption>
        <thead>
          <tr>
            <th scope="col">Critério</th>
            <th scope="col">{colunas[0]}</th>
            <th scope="col">{colunas[1]}</th>
          </tr>
        </thead>
        <tbody>
          {linhas.map((linha) => (
            <tr key={linha[0]}>
              <th scope="row">{linha[0]}</th>
              <td>{linha[1]}</td>
              <td>{linha[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div aria-hidden="true">
        {/* ── Alternador (telas estreitas) ──────────────────────────────── */}
        <div className="border-foreground/12 bg-foreground/[0.03] mb-4 grid grid-cols-2 gap-1 rounded-2xl border p-1 lg:hidden">
          {colunas.map((coluna, i) => (
            <button
              key={coluna}
              type="button"
              onClick={() => setAtiva(i as 0 | 1)}
              className={`focus-ring cursor-pointer rounded-xl px-4 py-2.5 [font-family:var(--font-poppins)] text-[14px] font-semibold transition-colors duration-300 ${
                ativa === i
                  ? "bg-[var(--mg-accent)] text-white"
                  : "text-foreground/60 hover:text-foreground"
              }`}
            >
              {coluna}
            </button>
          ))}
        </div>

        <ul className="border-foreground/12 m-0 list-none divide-y divide-[color-mix(in_oklab,currentColor_10%,transparent)] overflow-hidden rounded-3xl border p-0">
          {/* Cabeçalho só no desktop: no mobile quem faz esse papel é o
              alternador acima. */}
          <li className="text-foreground/65 bg-foreground/[0.03] hidden [font-family:var(--font-poppins)] text-[12px] font-semibold tracking-[0.12em] uppercase lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center">
            <span className="px-6 py-3 text-right">{colunas[0]}</span>
            <span className="px-6 py-3 text-center">critério</span>
            <span className="px-6 py-3">{colunas[1]}</span>
          </li>

          {linhas.map(([criterio, a, b]) => (
            <li
              key={criterio}
              className="group hover:bg-foreground/[0.03] grid grid-cols-1 gap-1 px-6 py-4 transition-colors duration-300 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-0 lg:py-5"
            >
              {/* Mobile: critério em cima, valor da coluna ativa embaixo. */}
              <span className="text-foreground/65 [font-family:var(--font-poppins)] text-[12px] font-semibold tracking-[0.12em] uppercase lg:hidden">
                {criterio}
              </span>
              <span className="text-foreground [font-family:var(--font-poppins)] text-[15px] leading-snug lg:hidden">
                {ativa === 0 ? a : b}
              </span>

              <span className="text-foreground/80 hidden [font-family:var(--font-poppins)] text-[15px] leading-snug lg:block lg:pr-6 lg:text-right">
                {a}
              </span>
              <span className="text-foreground/65 hidden [font-family:var(--font-poppins)] text-[12px] font-semibold tracking-[0.1em] whitespace-nowrap uppercase lg:block lg:w-48 lg:px-4 lg:text-center">
                <span className="border-foreground/12 group-hover:border-foreground/25 bg-background inline-block rounded-full border px-3 py-1 transition-colors duration-300">
                  {criterio}
                </span>
              </span>
              <span className="text-foreground/80 hidden [font-family:var(--font-poppins)] text-[15px] leading-snug lg:block lg:pl-6">
                {b}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

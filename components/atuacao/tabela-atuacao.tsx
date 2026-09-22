import type { ReactNode } from "react";

/* =============================================================================
   TABELA DAS PÁGINAS DE ATUAÇÃO

   Mesma matriz em dois desenhos, escolhidos por CSS (sem JS, sem duplicar
   conteúdo no DOM para leitor de tela — a versão de cartões é aria-hidden):

     · a partir de lg  → tabela de verdade, com cabeçalho grudado e zebra suave
     · abaixo disso    → um cartão por linha, com rótulo e valor em pares.
       Tabela de 4 colunas em tela de 390px vira uma palavra por linha; rolar
       tabela na horizontal é pior ainda, porque some com o cabeçalho.
   ========================================================================== */

type Props = {
  legenda: string;
  colunas: string[];
  linhas: string[][];
};

export function TabelaAtuacao({ legenda, colunas, linhas }: Props): ReactNode {
  return (
    <div className="mt-8">
      {/* ── Tabela (lg+) ─────────────────────────────────────────────────────
          sr-only em vez de hidden: abaixo de lg a tabela some da TELA, mas
          continua no fluxo de leitor de tela e de crawler. Com `hidden` ela
          sairia da árvore de acessibilidade e quem usa leitor ficaria só com
          os cartões, que são decorativos (aria-hidden). */}
      <div className="border-foreground/12 sr-only overflow-hidden rounded-3xl border lg:not-sr-only lg:block">
        <table className="w-full border-collapse text-left [font-family:var(--font-poppins)] text-[15px]">
          <caption className="text-foreground/65 bg-foreground/[0.03] px-6 pt-4 pb-4 text-left text-[13px]">
            {legenda}
          </caption>
          <thead>
            <tr className="border-foreground/12 bg-foreground/[0.03] border-y">
              {colunas.map((c) => (
                <th
                  key={c}
                  scope="col"
                  className="text-foreground/65 px-6 py-3 text-[12px] font-semibold tracking-[0.1em] whitespace-nowrap uppercase"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {linhas.map((linha) => (
              <tr
                key={linha[0]}
                className="border-foreground/8 hover:bg-foreground/[0.03] border-b transition-colors duration-300 last:border-0"
              >
                {linha.map((celula, ci) =>
                  ci === 0 ? (
                    <th
                      key={ci}
                      scope="row"
                      className="text-foreground px-6 py-4 font-semibold whitespace-nowrap"
                    >
                      <span className="inline-flex items-center gap-2.5">
                        <span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--mg-accent)]"
                        />
                        {celula}
                      </span>
                    </th>
                  ) : (
                    <td key={ci} className="text-foreground/70 px-6 py-4">
                      {celula}
                    </td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Cartões (abaixo de lg) ───────────────────────────────────────── */}
      <ul
        aria-hidden="true"
        className="m-0 flex list-none flex-col gap-3 p-0 lg:hidden"
      >
        {linhas.map((linha) => (
          <li
            key={linha[0]}
            className="border-foreground/12 bg-foreground/[0.02] rounded-2xl border p-5"
          >
            <p className="text-foreground [font-family:var(--font-gohan)] text-[15px] tracking-wide">
              {linha[0]}
            </p>
            <dl className="mt-3 grid grid-cols-1 gap-2">
              {linha.slice(1).map((celula, ci) => (
                <div
                  key={ci}
                  className="border-foreground/8 flex items-baseline justify-between gap-4 border-t pt-2 first:border-0 first:pt-0"
                >
                  <dt className="text-foreground/65 [font-family:var(--font-poppins)] text-[12px] tracking-[0.08em] uppercase">
                    {colunas[ci + 1]}
                  </dt>
                  <dd className="text-foreground/80 m-0 [font-family:var(--font-poppins)] text-right text-[14px] leading-snug">
                    {celula}
                  </dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
      <p className="text-foreground/65 mt-3 [font-family:var(--font-poppins)] text-[13px] lg:hidden">
        {legenda}
      </p>
    </div>
  );
}

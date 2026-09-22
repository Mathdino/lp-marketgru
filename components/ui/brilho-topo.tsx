import type { ReactNode } from "react";

/* =============================================================================
   BRILHO DE TOPO

   Fundo decorativo para cabeçalho de página, no lugar do shader.

   O shader (Grainient/ShaderFlow) pinta a própria imagem, escura, sem saber em
   que tema a página está: no tema claro o texto — que é escuro — caía em cima
   dele e sumia. Aqui o fundo é feito de dois gradientes do TOKEN de acento
   sobre o fundo da página: no claro fica um rosa bem lavado sobre branco, no
   escuro um vermelho fundo sobre preto. Nos dois casos o texto continua sendo
   lido, porque quem manda na luminosidade é o fundo do tema, não a decoração.

   Sem canvas, sem JS e sem custo de GPU.
   ========================================================================== */

export function BrilhoTopo({
  className = "",
}: {
  className?: string;
}): ReactNode {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
    >
      <span
        className="absolute -top-40 -right-24 h-[34rem] w-[34rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--mg-accent) 22%, transparent) 0%, transparent 68%)",
        }}
      />
      <span
        className="absolute -top-28 -left-32 h-[26rem] w-[26rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--mg-accent) 14%, transparent) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

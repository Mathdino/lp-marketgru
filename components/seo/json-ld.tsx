import type { ReactNode } from "react";

/* =============================================================================
   JSON-LD — emitido no SERVIDOR.

   Componente sem "use client" de propósito: o grafo precisa estar no HTML da
   primeira resposta. JSON-LD injetado por JavaScript passa no Rich Results Test
   e desaparece para todo agente que não executa script — e é justamente esse o
   público que este site quer atingir.
   ========================================================================== */
export function JsonLd({ data }: { data: object }): ReactNode {
  return (
    <script
      type="application/ld+json"
      // O conteúdo é gerado pelo próprio servidor a partir de dados tipados,
      // nunca de entrada de usuário.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

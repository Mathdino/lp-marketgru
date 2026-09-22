"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { ATUACAO_AREAS } from "@/lib/atuacao-data";

import { ShaderFlow } from "../shaders/shader-flow";

/* Rotas que desenham o próprio topo e por isso dispensam o shader do layout.
   A lista sai do MESMO array que gera as páginas de área: área nova já nasce
   com o comportamento certo, sem ninguém lembrar de vir aqui. */
const SEM_BACKDROP = new Set<string>([
  "/atuacao",
  /* /minimercado desenha o próprio topo (BrilhoTopo) e logo abaixo vem o bloco
     "Nossas unidades": com o shader de 660px do layout ligado, ele passava por
     baixo das unidades e, no tema claro, deixava texto escuro sobre fundo
     escuro no cabeçalho. */
  "/minimercado",
  ...ATUACAO_AREAS.map((area) => `/${area.slug}`),
]);

export function PageBackdrop(): ReactNode {
  const pathname = usePathname();

  if (SEM_BACKDROP.has(pathname)) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-165 overflow-hidden rounded-b-2xl"
    >
      <div className="absolute inset-0">
        <ShaderFlow brightness={3} iterations={10} flowSpeed={[0, 0.1]} />
      </div>
    </div>
  );
}

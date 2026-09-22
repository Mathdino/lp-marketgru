import { MapPin } from "lucide-react";
import type { ReactNode } from "react";

/* =============================================================================
   RAIO DE COBERTURA

   Desenho do argumento da seção: a área atendida é um raio logístico, não uma
   linha comercial no mapa. Três anéis saindo do mesmo ponto dizem isso mais
   rápido que o parágrafo — que continua ali do lado, porque o desenho ilustra,
   não substitui.

   SVG inline, sem imagem e sem biblioteca: escala em qualquer tela, acompanha
   o tema (usa currentColor e o token de acento) e não custa requisição. O pulso
   para sozinho em motion-reduce.
   ========================================================================== */

type Props = {
  cidades: string[];
};

export function RaioCobertura({ cidades }: Props): ReactNode {
  return (
    <div className="border-foreground/12 bg-foreground/[0.02] relative isolate overflow-hidden rounded-3xl border p-8">
      <div className="relative mx-auto aspect-square w-full max-w-[19rem]">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            aria-hidden="true"
            /* O estado PARADO já é visível (opacity no style): se a animação
               não rodar — aba em segundo plano, movimento reduzido, navegador
               econômico —, os anéis continuam desenhados. Animação que é a
               única fonte de visibilidade some com o desenho. */
            className="absolute inset-0 m-auto rounded-full border border-[var(--mg-accent)]"
            style={{
              width: `${40 + i * 30}%`,
              height: `${40 + i * 30}%`,
              opacity: 0.42 - i * 0.1,
              animation: `raio-pulso 3.6s ease-out ${i * 1.2}s infinite`,
            }}
          />
        ))}

        <span
          aria-hidden="true"
          className="absolute inset-0 m-auto h-[18%] w-[18%] rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--mg-accent) 45%, transparent) 0%, transparent 70%)",
          }}
        />

        <span className="absolute inset-0 m-auto grid h-14 w-14 place-items-center rounded-full bg-[var(--mg-accent)] text-white shadow-lg">
          <MapPin className="h-6 w-6" aria-hidden="true" />
          <span className="sr-only">São Paulo, centro da operação</span>
        </span>
      </div>

      <ul className="mt-6 flex list-none flex-wrap justify-center gap-2 p-0">
        {cidades.map((cidade) => (
          <li
            key={cidade}
            className="border-foreground/12 text-foreground/70 rounded-full border px-3.5 py-1.5 [font-family:var(--font-poppins)] text-[13px]"
          >
            {cidade}
          </li>
        ))}
      </ul>
    </div>
  );
}

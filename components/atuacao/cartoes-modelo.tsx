import Image from "next/image";
import type { ReactNode } from "react";

/* =============================================================================
   CARTÕES ILUSTRADOS

   Três fotos lado a lado (uma embaixo da outra no celular). Em repouso aparece
   só o título, no pé da imagem. No hover a foto desfoca e o texto abre embaixo
   do título, que continua na tela.

   Como isso não vira armadilha de acessibilidade:

    · o texto SEMPRE existe no DOM e nunca é `hidden` — ele é deslocado e
      transparente. Crawler e leitor de tela leem os três parágrafos;
    · a revelação responde a `:hover` E a `:focus-within`, então quem navega por
      teclado vê a mesma coisa que quem usa mouse;
    · abaixo de `md` (onde hover não existe) título e texto entram os dois
      visíveis, sem desfoque e sem depender de toque nenhum;
    · com `prefers-reduced-motion` o movimento some e fica só a troca de
      opacidade — a informação não depende da animação.
   ========================================================================== */

type Modelo = {
  titulo: string;
  texto: string;
  imagem: string;
  imagemAlt: string;
};

export function CartoesModelo({ modelos }: { modelos: Modelo[] }): ReactNode {
  return (
    <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-3">
      {modelos.map((modelo, i) => (
        <li key={modelo.titulo} className="h-full">
          <article
            tabIndex={0}
            className="focus-ring group bg-foreground/5 relative isolate flex h-full min-h-[22rem] flex-col justify-end overflow-hidden rounded-3xl md:min-h-[32rem]"
          >
            {/* O desfoque é da imagem, não do cartão: aplicado no wrapper com
                scale, para a borda desfocada não aparecer nos cantos. */}
            <span
              aria-hidden="true"
              className="absolute inset-0 -z-10 scale-105 transition-[filter,transform] duration-500 ease-out motion-reduce:transition-none md:group-focus-within:scale-110 md:group-focus-within:blur-[6px] md:group-hover:scale-110 md:group-hover:blur-[6px]"
            >
              <Image
                src={modelo.imagem}
                alt={modelo.imagemAlt}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover"
                priority={i === 0}
              />
            </span>

            {/* Véu de baixo para cima: garante o contraste do texto branco em
                cima de qualquer foto que venha depois. Ele fecha um pouco mais
                no hover, quando o que está por cima é um parágrafo inteiro. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/40 to-black/5 transition-colors duration-500 md:group-focus-within:via-black/70 md:group-focus-within:to-black/55 md:group-hover:from-black/85 md:group-hover:via-black/70 md:group-hover:to-black/55"
            />

            <div className="relative p-6">
              {/* O título fica, no pé da foto, em repouso e no hover. */}
              <h3 className="[font-family:var(--font-gohan)] text-[24px] leading-tight tracking-wide text-white">
                {modelo.titulo}
              </h3>

              {/* O texto abre embaixo do título no hover — como o cartão é um
                  flex alinhado ao fim, o bloco inteiro sobe sozinho conforme o
                  parágrafo ganha altura. max-height entra junto da opacidade
                  porque só opacidade deixaria um vão em branco reservado. */}
              <p className="mt-3 max-h-40 overflow-hidden [font-family:var(--font-poppins)] text-[14px] leading-relaxed text-white/90 transition-all duration-500 ease-out motion-reduce:translate-y-0 motion-reduce:transition-opacity md:mt-0 md:max-h-0 md:translate-y-2 md:opacity-0 md:group-focus-within:mt-3 md:group-focus-within:max-h-40 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100 md:group-hover:mt-3 md:group-hover:max-h-40 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                {modelo.texto}
              </p>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}

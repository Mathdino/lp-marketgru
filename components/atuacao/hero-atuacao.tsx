"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, type ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* =============================================================================
   TOPO DAS PÁGINAS DE ATUAÇÃO

   Substitui o shader global (desligado nestas rotas em page-backdrop.tsx) por
   um topo que fala do assunto da página em vez de ser textura genérica:
   trilha, selo, H1, resposta direta, duas ações e a foto com as provas
   flutuando em cima dela.

   Duas regras que o desenho respeita:
    · a cor sai de tokens (--mg-accent, --foreground, --background), então o
      claro e o escuro saem certos sem uma segunda folha de estilo;
    · nada que carregue informação depende de animação. O GSAP aqui só desloca
      o que já está na tela, e sob prefers-reduced-motion não roda.
   ========================================================================== */

type Chip = { valor: string; rotulo: string };

type Props = {
  trilha: { label: string; href?: string }[];
  selo: string;
  /* Ícone JÁ renderizado, não o componente: este arquivo é client, e função
     (como um LucideIcon) não atravessa a fronteira server → client. */
  icone: ReactNode;
  titulo: string;
  resumo: string;
  imagem: string;
  imagemAlt: string;
  chips?: Chip[];
  acaoPrimaria?: { label: string; href: string };
  acaoSecundaria?: { label: string; href: string };
  prioridadeImagem?: boolean;
  /* "moldura": foto retangular dentro do cartão arredondado — é o certo para
     fotografia, que sem borda fica com recorte sujo.
     "livre": arte recortada (PNG/WebP com alpha) solta na página, inclinada em
     3D e com sombra que segue o contorno. Pede imagem COM transparência:
     numa foto retangular o efeito vira um retângulo torto. */
  variante?: "moldura" | "livre";
};

export function HeroAtuacao({
  trilha,
  selo,
  icone,
  titulo,
  resumo,
  imagem,
  imagemAlt,
  chips = [],
  acaoPrimaria,
  acaoSecundaria,
  prioridadeImagem = true,
  variante = "moldura",
}: Props): ReactNode {
  const raizRef = useRef<HTMLElement>(null);
  const livre = variante === "livre";

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          anima: "(prefers-reduced-motion: no-preference)",
          reduzido: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          if (ctx.conditions?.reduzido) return;

          const entrada: HTMLElement[] = gsap.utils.toArray("[data-hero-item]");
          gsap.set(entrada, { y: 26, autoAlpha: 0 });
          const tween = gsap.to(entrada, {
            y: 0,
            autoAlpha: 1,
            duration: 0.55,
            ease: "power3.out",
            stagger: 0.08,
            clearProps: "transform,opacity,visibility",
          });

          /* Rede de segurança: se o relógio de animação não andar (aba em
             segundo plano, navegador em modo econômico, quadro engasgado), o
             conteúdo não pode ficar preso em opacity 0 — ele é o texto
             principal da página. Passado o tempo da animação, o estado final
             é aplicado de qualquer jeito. */
          const destravar = window.setTimeout(() => {
            if (!tween.progress()) gsap.set(entrada, { clearProps: "all" });
          }, 1600);

          /* Paralaxe curta na foto: 40px no total do scroll do bloco. Mais que
             isso descola a imagem do texto e vira efeito pelo efeito. */
          gsap.to("[data-hero-foto]", {
            yPercent: -6,
            ease: "none",
            scrollTrigger: {
              trigger: raizRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 0.5,
            },
          });

          gsap.to("[data-hero-brilho]", {
            scale: 1.12,
            opacity: 0.75,
            duration: 5,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });

          /* ── 3D da arte solta ───────────────────────────────────────────
             Só na variante "livre". A peça já nasce inclinada (o 3D tem que
             existir parado, não só no hover) e reage ao cursor dentro do
             topo. Em toque não há pointermove útil, então a inclinação de
             repouso é o efeito — nada depende do gesto. */
          const palco = livre
            ? raizRef.current?.querySelector<HTMLElement>("[data-hero-palco]")
            : null;

          if (!palco) return () => window.clearTimeout(destravar);

          const BASE_Y = -13;
          const BASE_X = 7;

          gsap.set(palco, {
            transformPerspective: 1100,
            transformOrigin: "50% 55%",
            rotationY: BASE_Y,
            rotationX: BASE_X,
          });

          gsap.to(palco, {
            y: -14,
            duration: 3.4,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });

          const paraY = gsap.quickTo(palco, "rotationY", {
            duration: 0.7,
            ease: "power3.out",
          });
          const paraX = gsap.quickTo(palco, "rotationX", {
            duration: 0.7,
            ease: "power3.out",
          });

          const aoMover = (e: PointerEvent): void => {
            const area = raizRef.current;
            if (!area) return;
            const r = area.getBoundingClientRect();
            /* -1 a 1 a partir do centro do topo */
            const dx = (e.clientX - r.left) / r.width - 0.5;
            const dy = (e.clientY - r.top) / r.height - 0.5;
            paraY(BASE_Y + dx * 18);
            paraX(BASE_X - dy * 14);
          };

          const aoSair = (): void => {
            paraY(BASE_Y);
            paraX(BASE_X);
          };

          const area = raizRef.current;
          area?.addEventListener("pointermove", aoMover);
          area?.addEventListener("pointerleave", aoSair);

          return () => {
            window.clearTimeout(destravar);
            area?.removeEventListener("pointermove", aoMover);
            area?.removeEventListener("pointerleave", aoSair);
          };
        }
      );

      return () => mm.revert();
    },
    { scope: raizRef, dependencies: [livre] }
  );

  return (
    <section
      ref={raizRef}
      className="relative isolate overflow-hidden px-6 pt-32 pb-10 sm:pt-40 sm:pb-14"
    >
      {/* Malha de cor no lugar do shader: dois brilhos de acento bem diluídos,
          que existem nos dois temas porque saem do mesmo token. */}
      <span
        aria-hidden="true"
        data-hero-brilho
        className="pointer-events-none absolute -top-40 -right-24 -z-10 h-[34rem] w-[34rem] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--mg-accent) 26%, transparent) 0%, transparent 68%)",
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-32 -z-10 h-[26rem] w-[26rem] rounded-full opacity-45 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--mg-accent) 16%, transparent) 0%, transparent 70%)",
        }}
      />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <nav aria-label="Trilha de navegação" className="mb-7" data-hero-item>
            <ol className="text-foreground/65 flex flex-wrap items-center gap-2 [font-family:var(--font-poppins)] text-[13px]">
              {trilha.map((item, i) => (
                <li key={item.label} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden="true">/</span>}
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-foreground/80 font-medium">
                      {item.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          <span
            data-hero-item
            className="border-foreground/15 bg-foreground/[0.04] text-foreground/75 mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 [font-family:var(--font-poppins)] text-[13px] font-medium"
          >
            <span aria-hidden="true" className="text-[var(--mg-accent)]">
              {icone}
            </span>
            {selo}
          </span>

          <h1
            data-hero-item
            className="text-foreground [font-family:var(--font-gohan)] text-[2.1rem] leading-[1.08] tracking-wide sm:text-[2.9rem] lg:text-[3.3rem]"
          >
            {titulo}
          </h1>

          {/* Resposta direta — o trecho citável. Fica antes de qualquer
              contexto, de propósito. */}
          <p
            data-hero-item
            className="text-foreground/75 mt-7 max-w-2xl border-l-2 border-[var(--mg-accent)] pl-5 [font-family:var(--font-poppins)] text-[17px] leading-relaxed sm:text-lg"
          >
            {resumo}
          </p>

          {(acaoPrimaria || acaoSecundaria) && (
            <div
              data-hero-item
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              {acaoPrimaria && (
                <Link
                  href={acaoPrimaria.href}
                  className="focus-ring group inline-flex items-center gap-2 rounded-xl bg-[var(--mg-accent)] px-5 py-3 [font-family:var(--font-poppins)] text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5"
                >
                  {acaoPrimaria.label}
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              )}
              {acaoSecundaria && (
                <Link
                  href={acaoSecundaria.href}
                  className="border-foreground/15 hover:border-foreground/35 text-foreground focus-ring inline-flex items-center gap-2 rounded-xl border px-5 py-3 [font-family:var(--font-poppins)] text-sm font-semibold transition-colors"
                >
                  {acaoSecundaria.label}
                </Link>
              )}
            </div>
          )}
        </div>

        {livre ? (
          /* ── Arte solta ───────────────────────────────────────────────
             Sem moldura, sem recorte e sem véu: a sombra é `drop-shadow`,
             que acompanha o alpha do arquivo em vez de desenhar um
             retângulo. Os chips descem para baixo da peça, porque aqui não
             existe fundo escuro onde eles possam pousar. */
          <div data-hero-item className="relative flex flex-col items-center">
            <div
              data-hero-foto
              className="relative flex w-full justify-center [perspective:1100px]"
            >
              {/* Sombra de chão: elipse difusa, só para a peça não flutuar
                  no vazio. Decorativa. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-2 left-1/2 h-10 w-[60%] -translate-x-1/2 rounded-[50%] bg-black/45 blur-2xl"
              />
              {/* Largura no PALCO, não na imagem: como item de flex, um div de
                  largura automática encolhe para o conteúdo e a arte sai bem
                  menor que a coluna. */}
              <div
                data-hero-palco
                className="relative w-full max-w-[560px] [transform-style:preserve-3d] will-change-transform"
              >
                <Image
                  src={imagem}
                  alt={imagemAlt}
                  width={458}
                  height={545}
                  sizes="(min-width: 1024px) 560px, 88vw"
                  className="h-auto w-full object-contain drop-shadow-[0_38px_52px_rgba(0,0,0,0.55)]"
                  priority={prioridadeImagem}
                />
              </div>
            </div>

            {chips.length > 0 && (
              <ul className="m-0 mt-6 flex list-none flex-wrap justify-center gap-2 p-0">
                {chips.map((chip) => (
                  <li
                    key={chip.rotulo}
                    className="border-foreground/15 bg-foreground/[0.04] rounded-2xl border px-3.5 py-2 backdrop-blur-md"
                  >
                    <span className="text-foreground block [font-family:var(--font-gohan)] text-[15px] leading-none tracking-wide">
                      {chip.valor}
                    </span>
                    <span className="text-foreground/60 mt-1 block [font-family:var(--font-poppins)] text-[11px] leading-none">
                      {chip.rotulo}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <div data-hero-item className="relative">
            <figure
              data-hero-foto
              className="ring-foreground/10 relative m-0 aspect-[4/3] w-full overflow-hidden rounded-[2rem] ring-1 lg:aspect-[5/4]"
            >
              <Image
                src={imagem}
                alt={imagemAlt}
                fill
                sizes="(min-width: 1024px) 560px, 100vw"
                className="object-cover"
                priority={prioridadeImagem}
              />
              {/* Véu escuro só na base, onde os chips pousam: garante contraste
                  do texto branco dos chips sobre qualquer foto. */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent"
              />
            </figure>

            {chips.length > 0 && (
              <ul className="absolute right-4 bottom-4 left-4 m-0 flex list-none flex-wrap gap-2 p-0">
                {chips.map((chip) => (
                  <li
                    key={chip.rotulo}
                    className="rounded-2xl border border-white/20 bg-black/45 px-3.5 py-2 backdrop-blur-md"
                  >
                    <span className="block [font-family:var(--font-gohan)] text-[15px] leading-none tracking-wide text-white">
                      {chip.valor}
                    </span>
                    <span className="mt-1 block [font-family:var(--font-poppins)] text-[11px] leading-none text-white/70">
                      {chip.rotulo}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

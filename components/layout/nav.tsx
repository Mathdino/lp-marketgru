"use client";

import { ChevronDown, Moon, Sun, type LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { StaggeredMenu } from "@/components/ui/staggered-menu";
import { ATUACAO_AREAS } from "@/lib/atuacao-data";

type NavItem = {
  label: string;
  href: string;
  /** Quando presente, o item vira um menu suspenso. */
  children?: {
    label: string;
    href: string;
    icon: LucideIcon;
    descricao: string;
  }[];
};

/* O submenu é montado a partir do MESMO array que gera as páginas. Área nova
   entra no menu sozinha — não existe lista de links duplicada para esquecer de
   atualizar. */
const ATUACAO_CHILDREN = ATUACAO_AREAS.map((area) => ({
  label: area.label,
  href: `/${area.slug}`,
  icon: area.icon,
  descricao: area.label === "Condomínios" ? "Residencial" : "Corporativo",
}));

const NAV_ITEMS: readonly NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Minimercado", href: "/minimercado" },
  { label: "Atuação", href: "/atuacao", children: ATUACAO_CHILDREN },
  { label: "Sobre Nós", href: "/sobre-nos" },
  { label: "Blog", href: "/blog" },
  { label: "Contato", href: "/contato" },
];

/* No mobile o submenu é achatado: o StaggeredMenu é uma lista simples, e
   esconder página atrás de acordeão dentro de menu fechado é esconder página. */
const STAGGERED_ITEMS = NAV_ITEMS.flatMap((item) => [
  { label: item.label, ariaLabel: `Ir para ${item.label}`, link: item.href },
  ...(item.children ?? []).map((c) => ({
    label: c.label,
    ariaLabel: `Ir para ${c.label}`,
    link: c.href,
  })),
]);

/* Abaixo desta largura o CSS estica a bandeja de ponta a ponta da tela
   (media query em globals.css). Medir aqui só atrapalharia. */
const LARGURA_BANDEJA_MEDIDA = 851;

/* =============================================================================
   BANDEJA DO MENU

   A faixa branca atrás do menu é um retângulo fixo em globals.css, e sua
   largura era um chute (`60vw`). Quando logo + itens + botão de tema somavam
   mais que isso — o que acontece na maioria das telas de notebook — as pontas
   vazavam para fora da faixa e ficavam soltas sobre o vermelho.

   Aqui a faixa passa a ser medida a partir do conteúdo real do menu. Vale para
   qualquer largura de tela, para o item de menu que ainda não existe e para
   quando a fonte custom carrega e muda a largura do texto (o ResizeObserver
   pega os três casos).
   ========================================================================== */
function useLarguraDaBandeja(alvo: React.RefObject<HTMLElement | null>): void {
  useLayoutEffect(() => {
    const raiz = document.documentElement;

    const aplicar = (): void => {
      const el = alvo.current;
      /* clientWidth, e não innerWidth: a bandeja é `position: fixed`, então ela
         se mede pela viewport SEM a barra de rolagem — que é também o que a
         media query de 850px enxerga. */
      const larguraViewport = raiz.clientWidth;

      if (!el || larguraViewport < LARGURA_BANDEJA_MEDIDA) {
        raiz.style.removeProperty("--nav-tray-width");
        return;
      }

      const gutter =
        Number.parseFloat(
          getComputedStyle(raiz).getPropertyValue("--nav-tray-gutter")
        ) || 0;
      const inset =
        Number.parseFloat(
          getComputedStyle(raiz).getPropertyValue("--frame-inset")
        ) || 0;

      /* Nunca mais larga que a moldura da página: a bandeja é centralizada, e
         passar disso encostaria nas bordas laterais. */
      const maxima = larguraViewport - 2 * inset;
      const largura = Math.min(
        Math.ceil(el.getBoundingClientRect().width + 2 * gutter),
        maxima
      );

      raiz.style.setProperty("--nav-tray-width", `${largura}px`);
    };

    aplicar();

    /* Observa o menu (mudou de item, a fonte carregou) E a raiz do documento
       (a janela mudou de tamanho). O evento `resize` sozinho já daria conta na
       maioria dos casos, mas o observer também cobre zoom e mudança de largura
       sem evento — o custo é o mesmo. */
    const observer = new ResizeObserver(aplicar);
    if (alvo.current) observer.observe(alvo.current);
    observer.observe(raiz);
    window.addEventListener("resize", aplicar);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", aplicar);
      raiz.style.removeProperty("--nav-tray-width");
    };
  }, [alvo]);
}

function useIsMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

function NavThemeToggle(): ReactNode {
  const mounted = useIsMounted();
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = mounted && resolvedTheme === "dark";

  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>): void => {
    const next = isDark ? "light" : "dark";

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const supportsViewTransitions =
      typeof document !== "undefined" &&
      typeof document.startViewTransition === "function";

    if (!supportsViewTransitions || prefersReducedMotion) {
      setTheme(next);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const radius = Math.hypot(
      Math.max(cx, window.innerWidth - cx),
      Math.max(cy, window.innerHeight - cy)
    );

    const root = document.documentElement;
    root.style.setProperty("--theme-cx", `${cx}px`);
    root.style.setProperty("--theme-cy", `${cy}px`);
    root.style.setProperty("--theme-r", `${radius}px`);
    root.dataset.themeAnim = "1";

    const transition = document.startViewTransition(() => {
      setTheme(next);
    });

    transition.finished.finally(() => {
      delete root.dataset.themeAnim;
    });
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        mounted
          ? isDark
            ? "Switch to light theme"
            : "Switch to dark theme"
          : "Toggle theme"
      }
      aria-pressed={mounted ? isDark : undefined}
      className="site-nav__toggle focus-ring relative inline-flex h-[var(--nav-control)] w-[var(--nav-control)] shrink-0 cursor-pointer items-center justify-center rounded-full border"
    >
      <span aria-hidden="true" className="relative h-5 w-5">
        <Sun
          className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
            mounted && isDark
              ? "scale-100 rotate-0 opacity-100"
              : "scale-0 -rotate-90 opacity-0"
          }`}
        />
        <Moon
          className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
            mounted && !isDark
              ? "scale-100 rotate-0 opacity-100"
              : "scale-0 rotate-90 opacity-0"
          }`}
        />
      </span>
    </button>
  );
}

/* =============================================================================
   MENU SUSPENSO

   Acessibilidade, ponto a ponto:
    · <button> nativo com aria-expanded e aria-controls — não é <div> com
      onClick, porque leitor de tela e agente de navegação dependem do papel;
    · abre no clique E no foco por teclado, fecha com Escape devolvendo o foco
      ao gatilho, e fecha ao clicar fora;
    · abre no hover apenas como conforto de mouse; o hover nunca é a ÚNICA
      forma de abrir;
    · os itens são <Link> reais. Mesmo com o menu fechado eles existem no DOM,
      então o crawler segue os links sem precisar simular interação.
   ========================================================================== */
function NavDropdown({
  item,
  isActive,
}: {
  item: NavItem;
  isActive: boolean;
}): ReactNode {
  const [aberto, setAberto] = useState(false);
  const raizRef = useRef<HTMLDivElement>(null);
  const gatilhoRef = useRef<HTMLButtonElement>(null);
  const fecharTimer = useRef<number | null>(null);
  const painelId = "nav-submenu-atuacao";

  const cancelarFechamento = useCallback(() => {
    if (fecharTimer.current !== null) {
      window.clearTimeout(fecharTimer.current);
      fecharTimer.current = null;
    }
  }, []);

  /* Pequeno atraso ao sair com o mouse: sem ele o menu fecha na diagonal
     entre o gatilho e o primeiro item. */
  const agendarFechamento = useCallback(() => {
    cancelarFechamento();
    fecharTimer.current = window.setTimeout(() => setAberto(false), 140);
  }, [cancelarFechamento]);

  useEffect(() => cancelarFechamento, [cancelarFechamento]);

  useEffect(() => {
    if (!aberto) return;

    const aoTeclar = (ev: KeyboardEvent): void => {
      if (ev.key === "Escape") {
        setAberto(false);
        gatilhoRef.current?.focus();
      }
    };
    const aoClicarFora = (ev: MouseEvent): void => {
      if (!raizRef.current?.contains(ev.target as Node)) setAberto(false);
    };

    document.addEventListener("keydown", aoTeclar);
    document.addEventListener("mousedown", aoClicarFora);
    return () => {
      document.removeEventListener("keydown", aoTeclar);
      document.removeEventListener("mousedown", aoClicarFora);
    };
  }, [aberto]);

  const filhos = item.children ?? [];

  return (
    <div
      ref={raizRef}
      className="relative"
      onMouseEnter={() => {
        cancelarFechamento();
        setAberto(true);
      }}
      onMouseLeave={agendarFechamento}
      onFocus={cancelarFechamento}
      onBlur={(ev) => {
        if (!raizRef.current?.contains(ev.relatedTarget as Node))
          setAberto(false);
      }}
    >
      <button
        ref={gatilhoRef}
        type="button"
        aria-expanded={aberto}
        aria-controls={painelId}
        aria-haspopup="true"
        onClick={() => setAberto((v) => !v)}
        className="focus-ring relative inline-flex cursor-pointer items-center justify-center gap-1 rounded-full px-[var(--nav-item-px)] py-1.5 text-[length:var(--nav-item-size)] font-semibold whitespace-nowrap transition-colors duration-300"
      >
        <span
          style={isActive ? { color: "var(--mg-accent)" } : undefined}
          className={
            isActive
              ? "relative z-10 opacity-100"
              : "relative z-10 opacity-60 hover:opacity-100"
          }
        >
          {item.label}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={`relative z-10 h-4 w-4 transition-transform duration-300 ${
            aberto ? "rotate-180" : ""
          } ${isActive ? "opacity-100" : "opacity-60"}`}
          style={isActive ? { color: "var(--mg-accent)" } : undefined}
        />
      </button>

      {/* A visibilidade é do CSS, via data-aberto — NÃO de uma biblioteca de
          animação. Se o motion não rodar (aba estrangulada, erro no bundle), o
          painel continua abrindo: animação nunca pode ser dona de quem vê o quê.
          O `hidden` do atributo também tira o painel do foco por teclado quando
          fechado, o que uma opacidade 0 sozinha não faria. */}
      <div
        id={painelId}
        data-aberto={aberto ? "true" : "false"}
        className="site-nav__dropdown absolute top-[calc(100%+14px)] left-1/2 z-50 w-[19rem] -translate-x-1/2 rounded-2xl border p-2"
      >
        <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
          {filhos.map((filho) => {
            const Icone = filho.icon;
            return (
              <li key={filho.href}>
                <Link
                  href={filho.href}
                  onClick={() => setAberto(false)}
                  className="site-nav__dropdown-item focus-ring flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-200"
                >
                  {/* Ícone à esquerda do nome, como pedido. */}
                  <span
                    aria-hidden="true"
                    className="site-nav__dropdown-icon grid h-9 w-9 shrink-0 place-items-center rounded-lg"
                  >
                    <Icone className="h-[18px] w-[18px]" />
                  </span>
                  <span className="flex flex-col leading-tight">
                    <span className="text-[15px] font-semibold">
                      {filho.label}
                    </span>
                    <span className="site-nav__dropdown-desc text-[12px]">
                      {filho.descricao}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}

          <li className="site-nav__dropdown-sep mt-1 border-t pt-1">
            <Link
              href={item.href}
              onClick={() => setAberto(false)}
              className="site-nav__dropdown-item focus-ring flex items-center justify-between rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-colors duration-200"
            >
              Ver todas as áreas
              <span aria-hidden="true">→</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export function Nav(): ReactNode {
  const pathname = usePathname();
  const barraRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [pillRect, setPillRect] = useState<{
    x: number;
    width: number;
  } | null>(null);
  const [hasMeasured, setHasMeasured] = useState(false);

  /* Um item com submenu também fica ativo quando a rota é uma das filhas —
     senão a página de área abriria sem nenhuma marcação no menu. */
  const estaAtivo = (item: NavItem): boolean => {
    if (item.href === "/") return pathname === "/";
    if (pathname === item.href || pathname.startsWith(`${item.href}/`))
      return true;
    return (item.children ?? []).some((c) => pathname === c.href);
  };

  const activeIndex = NAV_ITEMS.findIndex(estaAtivo);

  useLarguraDaBandeja(barraRef);

  useLayoutEffect(() => {
    const frameId = requestAnimationFrame(() => {
      const list = listRef.current;
      const activeEl = activeIndex >= 0 ? itemRefs.current[activeIndex] : null;
      if (!list || !activeEl) {
        setPillRect(null);
        return;
      }
      const listRect = list.getBoundingClientRect();
      const itemRect = activeEl.getBoundingClientRect();
      setPillRect({
        x: itemRect.left - listRect.left,
        width: itemRect.width,
      });
    });

    return () => cancelAnimationFrame(frameId);
  }, [activeIndex, pathname]);

  useEffect(() => {
    if (!pillRect) return;
    const id = requestAnimationFrame(() => setHasMeasured(true));
    return () => cancelAnimationFrame(id);
  }, [pillRect]);

  return (
    <>
      {/* Mobile Nav */}
      <div className="block md:hidden">
        <StaggeredMenu
          items={STAGGERED_ITEMS}
          isFixed={true}
          logoUrl="/logo-black.png"
          logoDarkUrl="/logo-black.png"
          menuButtonColor="#ffffff"
          openMenuButtonColor="#ffffff"
          colors={["#1a1a1a", "#f8301a"]}
          accentColor="#f8301a"
          displaySocials={false}
          displayItemNumbering={true}
          showThemeToggle={true}
        />
      </div>

      {/* Desktop Nav */}
      <nav
        aria-label="Primary"
        /* w-max: sem isso o elemento fixo herda como largura disponível apenas
           `100% - left` (metade da viewport) e o flex espreme logo e toggle. */
        className="fixed top-6 left-1/2 z-50 hidden w-max -translate-x-1/2 md:block"
      >
        <div
          ref={barraRef}
          className="site-nav -mt-4 flex flex-nowrap items-center gap-[var(--nav-bar-gap)] [font-family:var(--font-geist-sans)] whitespace-nowrap"
        >
          {/* Logo — troca automaticamente com o tema */}
          <Link
            href="/"
            aria-label="Ir para home"
            className="focus-ring mr-1 shrink-0 rounded-lg"
          >
            {/* width/height seguem a proporção real do arquivo (749×333). Com a
                proporção errada o box fica maior que o desenho e o object-contain
                deixa sobra dos dois lados. */}
            <Image
              src="/logo-black.png"
              alt="Logo"
              width={749}
              height={333}
              priority
              className="h-[var(--nav-control)] w-auto object-contain dark:hidden"
            />
            <Image
              src="/logo-white.png"
              alt="Logo"
              width={756}
              height={330}
              priority
              className="hidden h-[var(--nav-control)] w-auto object-contain dark:block"
            />
          </Link>

          <ul
            ref={listRef}
            className="relative flex flex-nowrap items-center gap-1 whitespace-nowrap"
          >
            {pillRect && (
              <motion.span
                aria-hidden="true"
                initial={false}
                animate={{ x: pillRect.x, width: pillRect.width }}
                transition={
                  hasMeasured
                    ? { type: "spring", stiffness: 380, damping: 32 }
                    : { duration: 0 }
                }
                style={{
                  left: 0,
                  bottom: 0,
                  height: 2,
                  backgroundColor: "#f8301a",
                  border: "none",
                }}
                className="absolute rounded-full"
              />
            )}
            {NAV_ITEMS.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <li
                  key={item.href}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  className="relative shrink-0"
                >
                  {item.children ? (
                    <NavDropdown item={item} isActive={isActive} />
                  ) : (
                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className="focus-ring relative inline-flex cursor-pointer items-center justify-center rounded-full px-[var(--nav-item-px)] py-1.5 text-[length:var(--nav-item-size)] font-semibold whitespace-nowrap transition-colors duration-300"
                    >
                      <span
                        style={isActive ? { color: "#f8301a" } : undefined}
                        className={
                          isActive
                            ? "relative z-10 opacity-100"
                            : "relative z-10 opacity-60 hover:opacity-100"
                        }
                      >
                        {item.label}
                      </span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
          <NavThemeToggle />
        </div>
      </nav>
    </>
  );
}

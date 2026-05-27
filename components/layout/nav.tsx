"use client";

import { Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { StaggeredMenu } from "@/components/ui/staggered-menu";

type NavItem = {
  label: string;
  href: string;
};

const NAV_ITEMS: readonly NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Minimercado", href: "/minimercado" },
  { label: "Sobre Nós", href: "/sobre-nos" },
  { label: "Blog", href: "/blog" },
  { label: "Contato", href: "/contato" },
];

const STAGGERED_ITEMS = NAV_ITEMS.map((item) => ({
  label: item.label,
  ariaLabel: `Ir para ${item.label}`,
  link: item.href,
}));

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
      className="site-nav__toggle focus-ring relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border"
    >
      <span aria-hidden="true" className="relative h-4 w-4">
        <Sun
          className={`absolute inset-0 h-4 w-4 transition-all duration-300 ${
            mounted && isDark
              ? "scale-100 rotate-0 opacity-100"
              : "scale-0 -rotate-90 opacity-0"
          }`}
        />
        <Moon
          className={`absolute inset-0 h-4 w-4 transition-all duration-300 ${
            mounted && !isDark
              ? "scale-100 rotate-0 opacity-100"
              : "scale-0 rotate-90 opacity-0"
          }`}
        />
      </span>
    </button>
  );
}

export function Nav(): ReactNode {
  const pathname = usePathname();
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [pillRect, setPillRect] = useState<{
    x: number;
    width: number;
  } | null>(null);
  const [hasMeasured, setHasMeasured] = useState(false);

  const activeIndex = NAV_ITEMS.findIndex((item) =>
    item.href === "/"
      ? pathname === "/"
      : pathname === item.href || pathname.startsWith(`${item.href}/`)
  );

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
        className="fixed top-6 left-1/2 z-50 hidden -translate-x-1/2 md:block"
      >
        <div className="site-nav -mt-4 flex flex-nowrap items-center gap-6 [font-family:var(--font-geist-sans)] whitespace-nowrap">
          {/* Logo — troca automaticamente com o tema */}
          <Link
            href="/"
            aria-label="Ir para home"
            className="focus-ring mr-1 rounded-lg"
          >
            <Image
              src="/logo-black.png"
              alt="Logo"
              width={110}
              height={32}
              priority
              className="h-17 w-auto object-contain dark:hidden"
            />
            <Image
              src="/logo-white.png"
              alt="Logo"
              width={110}
              height={32}
              priority
              className="hidden h-17 w-auto object-contain dark:block"
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
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className="focus-ring relative inline-flex cursor-pointer items-center justify-center rounded-full px-4 py-1.5 text-[17px] font-semibold whitespace-nowrap transition-colors duration-300"
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

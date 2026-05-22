import Image from "next/image";
import Link from "next/link";
import { Instagram, Facebook, Youtube, Mail } from "lucide-react";
import type { ReactNode } from "react";

/* ─── Config ─────────────────────────────────────────── */
const WHATSAPP_NUMBER = "5511999999999";
const EMAIL_DESTINO = "contato@exemplo.com.br";

const INSTAGRAM_URL = "https://instagram.com/";
const FACEBOOK_URL = "https://facebook.com/";
const YOUTUBE_URL = "https://youtube.com/@";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Minimercado", href: "/minimercado" },
  { label: "Sobre Nós", href: "/sobre-nos" },
  { label: "Blog", href: "/blog" },
  { label: "Contato", href: "/contato" },
];

/* ─── WhatsApp SVG ───────────────────────────────────── */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/* ─── Footer ─────────────────────────────────────────── */
export function Footer(): ReactNode {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative w-full transition-colors duration-300"
      style={{ backgroundColor: "var(--frame)" }}
    >
      {/* ── Cantos côncavos no topo ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 z-10"
        style={{
          width: "var(--frame-radius)",
          height: "var(--frame-radius)",
          background:
            "radial-gradient(circle at bottom right, transparent 0 var(--frame-radius), var(--background) calc(var(--frame-radius) + 1px))",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 z-10"
        style={{
          width: "var(--frame-radius)",
          height: "var(--frame-radius)",
          background:
            "radial-gradient(circle at bottom left, transparent 0 var(--frame-radius), var(--background) calc(var(--frame-radius) + 1px))",
        }}
      />

      {/* ── Conteúdo ── */}
      <div className="mx-auto max-w-275 px-10 pt-12 pb-10">
        {/* Linha principal */}
        <div className="grid gap-10 sm:grid-cols-[1fr_auto_auto] sm:gap-16 lg:gap-24">
          {/* Logo + descrição */}
          <div className="flex flex-col gap-5">
            <Link href="/" aria-label="Ir para home">
              {/* light mode → frame é escuro → logo branca */}
              <Image
                src="/logo-black.png"
                alt="Logo"
                width={140}
                height={40}
                className="w-auto object-contain dark:hidden"
              />
              {/* dark mode → frame é claro → logo preta */}
              <Image
                src="/logo-white.png"
                alt="Logo"
                width={140}
                height={40}
                className="hidden w-auto object-contain dark:block"
              />
            </Link>
            <p className="max-w-[28ch] text-[14px] leading-[1.6] text-[var(--frame-foreground)]/75">
              Levando praticidade e comodidade para condomínios com o melhor em
              minimercado autônomo.
            </p>

            {/* Redes sociais */}
            <div className="mt-1 flex items-center gap-2">
              {[
                { href: INSTAGRAM_URL, label: "Instagram", Icon: Instagram },
                { href: FACEBOOK_URL, label: "Facebook", Icon: Facebook },
                { href: YOUTUBE_URL, label: "Youtube", Icon: Youtube },
              ].map(({ href, label, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--frame-foreground)]/10 text-[var(--frame-foreground)] transition-colors hover:bg-[var(--frame-foreground)]/20"
                >
                  <Icon className="h-4 w-4" strokeWidth={2} />
                </Link>
              ))}
            </div>
          </div>

          {/* Navegação */}
          <div className="flex flex-col gap-4">
            <p className="text-[11px] font-semibold tracking-[0.12em] text-[var(--frame-foreground)]/50 uppercase">
              Navegação
            </p>
            <ul className="flex flex-col gap-2.5">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-[14px] font-medium text-[var(--frame-foreground)]/80 transition-colors hover:text-[var(--frame-foreground)]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div className="flex flex-col gap-4">
            <p className="text-[11px] font-semibold tracking-[0.12em] text-[var(--frame-foreground)]/50 uppercase">
              Contato
            </p>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  href={`mailto:${EMAIL_DESTINO}`}
                  className="inline-flex items-center gap-2.5 text-[14px] font-medium text-[var(--frame-foreground)]/80 transition-colors hover:text-[var(--frame-foreground)]"
                >
                  <Mail className="h-4 w-4 shrink-0" strokeWidth={2} />
                  {EMAIL_DESTINO}
                </Link>
              </li>
              <li>
                <Link
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-[14px] font-medium text-[var(--frame-foreground)]/80 transition-colors hover:text-[var(--frame-foreground)]"
                >
                  <WhatsAppIcon className="h-4 w-4 shrink-0" />
                  WhatsApp
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Linha divisória + copyright */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-[var(--frame-foreground)]/15 pt-6 sm:flex-row">
          <p className="text-[13px] text-[var(--frame-foreground)]/55">
            © {year} Market Gru. Todos os direitos reservados.
          </p>
          <p className="text-[12px] text-[var(--frame-foreground)]/40">
            Desenvolvido por MathDino
          </p>
        </div>
      </div>
    </footer>
  );
}

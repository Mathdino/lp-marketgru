"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import {
  CONSENT_CHANGE_EVENT,
  OPEN_PREFERENCES_EVENT,
  readConsent,
  saveConsent,
} from "@/lib/consent";

/* =============================================================================
   BANNER DE COOKIES + PREFERÊNCIAS

   · Aceitar e recusar têm o mesmo peso visual: a ANPD considera padrão
     enganoso esconder a recusa atrás de um link ou de um botão apagado.
   · No painel de preferências as categorias começam DESMARCADAS quando não
     há escolha salva — consentimento na LGPD é opt-in, não opt-out.
   · O painel usa <dialog> nativo: foco preso, Esc fecha e o resto da página
     fica inerte sem biblioteca nenhuma.
   · No desktop o banner fica à esquerda para não cobrir o botão do WhatsApp.
   ========================================================================== */

const btnBase =
  "focus-ring inline-flex cursor-pointer items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition-opacity hover:opacity-90";
const btnPrimary = `${btnBase} bg-foreground text-background`;
const btnSecondary = `${btnBase} border border-foreground/20 text-foreground hover:bg-foreground/5`;

function subscribeConsent(onChange: () => void) {
  window.addEventListener(CONSENT_CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onChange);
}

export function CookieConsent(): ReactNode {
  /* O cookie é lido só no cliente: no servidor o snapshot é "já escolheu",
     então o HTML sai sem banner e ele aparece depois da hidratação apenas
     para quem ainda não escolheu. */
  const bannerOpen = useSyncExternalStore(
    subscribeConsent,
    () => readConsent() === null,
    () => false
  );
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const openPreferences = () => {
      const saved = readConsent();
      setAnalytics(saved?.analytics ?? false);
      setMarketing(saved?.marketing ?? false);
      dialogRef.current?.showModal();
    };
    window.addEventListener(OPEN_PREFERENCES_EVENT, openPreferences);
    return () =>
      window.removeEventListener(OPEN_PREFERENCES_EVENT, openPreferences);
  }, []);

  function decide(a: boolean, m: boolean) {
    saveConsent(a, m);
    dialogRef.current?.close();
  }

  return (
    <>
      {bannerOpen && (
        <div
          role="region"
          aria-label="Aviso de cookies"
          className="border-foreground/10 bg-background text-foreground fixed inset-x-3 bottom-3 z-[70] rounded-2xl border p-5 [font-family:var(--font-poppins)] shadow-2xl sm:inset-x-auto sm:bottom-7 sm:left-7 sm:max-w-[420px]"
        >
          <p className="text-[15px] font-semibold">
            Usamos cookies para melhorar sua experiência
          </p>
          <p className="text-foreground/70 mt-1.5 text-[13px] leading-[1.55]">
            Os essenciais mantêm o site funcionando. Com a sua autorização,
            também usamos cookies de análise (Google Analytics) para entender
            como o site é usado. Veja a{" "}
            <Link
              href="/politica-de-privacidade"
              className="text-foreground underline underline-offset-2"
            >
              política de privacidade
            </Link>
            .
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              className={btnSecondary}
              onClick={() => decide(false, false)}
            >
              Recusar
            </button>
            <button
              type="button"
              className={btnPrimary}
              onClick={() => decide(true, true)}
            >
              Aceitar todos
            </button>
          </div>
          <button
            type="button"
            className="text-foreground/70 hover:text-foreground focus-ring mt-3 w-full cursor-pointer rounded text-center text-[13px] underline underline-offset-2"
            onClick={() =>
              window.dispatchEvent(new Event(OPEN_PREFERENCES_EVENT))
            }
          >
            Personalizar
          </button>
        </div>
      )}

      <dialog
        ref={dialogRef}
        aria-labelledby="cookie-prefs-title"
        className="border-foreground/10 bg-background text-foreground m-auto w-[calc(100%-1.5rem)] max-w-lg rounded-2xl border p-6 [font-family:var(--font-poppins)] shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm"
      >
        <h2 id="cookie-prefs-title" className="text-lg font-semibold">
          Preferências de cookies
        </h2>
        <p className="text-foreground/70 mt-1.5 text-[13px] leading-[1.55]">
          Escolha o que autoriza. Você pode mudar a qualquer momento pelo link
          &ldquo;Preferências de cookies&rdquo; no rodapé.
        </p>

        <ul className="mt-5 flex flex-col gap-3">
          <Categoria
            titulo="Essenciais"
            descricao="Necessários para o site funcionar e para lembrar esta escolha. Sempre ativos."
            checked
            disabled
          />
          <Categoria
            titulo="Análise"
            descricao="Google Analytics: páginas visitadas e tempo de navegação, de forma agregada."
            checked={analytics}
            onChange={setAnalytics}
          />
          <Categoria
            titulo="Marketing"
            descricao="Medição de anúncios e remarketing do Google. Hoje o site não usa, mas a escolha já vale se passar a usar."
            checked={marketing}
            onChange={setMarketing}
          />
        </ul>

        <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <button
            type="button"
            className={btnSecondary}
            onClick={() => decide(false, false)}
          >
            Recusar todos
          </button>
          <button
            type="button"
            className={btnSecondary}
            onClick={() => decide(analytics, marketing)}
          >
            Salvar escolha
          </button>
          <button
            type="button"
            className={btnPrimary}
            onClick={() => decide(true, true)}
          >
            Aceitar todos
          </button>
        </div>
      </dialog>
    </>
  );
}

function Categoria({
  titulo,
  descricao,
  checked,
  disabled,
  onChange,
}: {
  titulo: string;
  descricao: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}): ReactNode {
  return (
    <li>
      <label
        className={`border-foreground/10 bg-foreground/[0.03] flex items-start gap-3 rounded-xl border p-3.5 ${
          disabled ? "opacity-70" : "cursor-pointer"
        }`}
      >
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--mg-accent)]"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
        />
        <span className="flex flex-col gap-0.5">
          <span className="text-[14px] font-semibold">{titulo}</span>
          <span className="text-foreground/65 text-[12.5px] leading-[1.5]">
            {descricao}
          </span>
        </span>
      </label>
    </li>
  );
}

/* Botão do rodapé. O Footer é Server Component, então o clique mora aqui. */
export function CookiePreferencesButton({
  className,
}: {
  className?: string;
}): ReactNode {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event(OPEN_PREFERENCES_EVENT))}
    >
      Preferências de cookies
    </button>
  );
}
